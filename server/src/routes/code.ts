import { Request, Response } from 'express';
import openaiClient from '../services/openaiClient';
import { authMiddleware } from '../middleware/authMiddleware';
import { Router } from 'express';

const router = Router();

const CODE_SYSTEM_PROMPT = `You are an expert code assistant. Your job is to analyze code and generate precise patches based on user requests.

When given a user request and a codebase, you should:
1. Understand what the user wants to accomplish
2. Analyze the existing code structure
3. Generate a plan describing what changes need to be made
4. Create specific operations to implement those changes

IMPORTANT RULES:
- Always respond with valid JSON
- Use the exact format specified below
- Be precise and conservative with changes
- Preserve existing code style and patterns
- Only modify what's necessary to fulfill the request
- Include proper error handling and TypeScript types when applicable

Response format:
{
  "plan": "A clear description of what changes will be made",
  "operations": [
    {
      "op": "write|delete|rename",
      "path": "file/path",
      "content": "full file content for write operations",
      "newPath": "new/path (only for rename operations)"
    }
  ]
}

Operation types:
- "write": Create or completely replace a file with new content
- "delete": Remove a file entirely
- "rename": Change a file's path/name

For "write" operations, always provide the COMPLETE file content, not just the changes.`;

interface CodeRequest {
  prompt: string;
  files: Record<string, string>;
  activeFilePath?: string;
  workspaceId?: string;
}

interface CodePatch {
  plan: string;
  operations: Array<{
    op: 'write' | 'delete' | 'rename';
    path: string;
    content?: string;
    newPath?: string;
  }>;
}

// POST /code - Generate code patches
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const startTime = Date.now();
    const userId = req.userId;

  try {
    console.log(`[Code] Request from userId: ${userId}`);

    const { prompt, files, activeFilePath, workspaceId }: CodeRequest = req.body;

    // Validate request
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'Prompt is required and must be a string'
      });
    }

    if (!files || typeof files !== 'object') {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'Files object is required'
      });
    }

    // Build context for the AI
    const fileList = Object.keys(files).map(path => `- ${path}`).join('\n');
    const activeFileContent = activeFilePath && files[activeFilePath] 
      ? `\n\nCurrent active file (${activeFilePath}):\n\`\`\`\n${files[activeFilePath]}\n\`\`\``
      : '';

    const contextMessage = `Project structure:
${fileList}

Files content:
${Object.entries(files).map(([path, content]) => 
  `\n--- ${path} ---\n${content}`
).join('\n')}${activeFileContent}

User request: ${prompt}

Please analyze the code and provide a patch to fulfill this request.`;

    console.log(`[Code] Calling OpenAI for userId: ${userId}, files: ${Object.keys(files).length}`);

    // TEST MODE: Return mock response if in development or API key invalid
    if (process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_MODE === 'true') {
      console.log(`[Code] TEST MODE: Returning mock response for userId: ${userId}`);
      
      const mockPatch: CodePatch = {
        plan: `Test modu aktif! "${prompt}" isteğiniz için mock kod değişiklikleri hazırlandı. Gerçek OpenAI key'i ekleyince tam özellikli kod üretimi yapılacak.`,
        operations: [
          {
            op: 'write',
            path: activeFilePath || 'test-file.js',
            content: `// Test modu ile oluşturulan kod
// İstek: ${prompt}
// Tarih: ${new Date().toISOString()}

console.log('Test modu aktif! Backend entegrasyonu çalışıyor.');
console.log('Gerçek OpenAI key\'i ekleyince tam kod üretimi yapılacak.');

// Mock kod değişiklikleri
function mockFunction() {
  return 'Backend API entegrasyonu başarılı!';
}

export default mockFunction;`
          }
        ]
      };

      const duration = Date.now() - startTime;
      console.log(`[Code] TEST MODE Success for userId: ${userId}, duration: ${duration}ms`);

      return res.json({
        success: true,
        data: mockPatch,
        metadata: {
          duration,
          operationCount: mockPatch.operations.length,
          fileCount: Object.keys(files).length,
          testMode: true
        }
      });
    }

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: CODE_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: contextMessage
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    let patch: CodePatch;
    try {
      patch = JSON.parse(response);
    } catch (parseError) {
      console.error('[Code] Failed to parse AI response:', response);
      throw new Error('AI response format is invalid');
    }

    // Validate patch structure
    if (!patch.plan || !Array.isArray(patch.operations)) {
      throw new Error('Invalid patch structure');
    }

    // Validate operations
    for (const op of patch.operations) {
      if (!op.op || !op.path) {
        throw new Error('Invalid operation structure');
      }
      
      if (op.op === 'write' && !op.content) {
        throw new Error('Write operation missing content');
      }
      
      if (op.op === 'rename' && !op.newPath) {
        throw new Error('Rename operation missing newPath');
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[Code] Success for userId: ${userId}, duration: ${duration}ms, operations: ${patch.operations.length}`);

    res.json({
      success: true,
      data: patch,
      metadata: {
        duration,
        operationCount: patch.operations.length,
        fileCount: Object.keys(files).length
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Code] Error for userId: ${userId}, duration: ${duration}ms:`, error);
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('API key')) {
        // TEST MODE: Return mock response for API key errors in development
        if (process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_MODE === 'true') {
          console.log(`[Code] TEST MODE: API key error, returning mock response for userId: ${userId}`);
          
          const mockPatch: CodePatch = {
            plan: `Test modu aktif! OpenAI API key geçersiz ama sistem çalışıyor. "${req.body.prompt || 'kod değişikliği'}" isteğiniz için mock yanıt hazırlandı.`,
            operations: [
              {
                op: 'write',
                path: req.body.activeFilePath || 'mock-generated.js',
                content: `// Test modu ile oluşturulan kod (API key geçersiz)
// Backend entegrasyonu çalışıyor!

console.log('Code modülü backend\'e başarıyla bağlandı!');
console.log('Test modu sayesinde API key olmadan da çalışıyor.');

// Mock kod üretimi
function testModeFunction() {
  return {
    message: 'Backend API entegrasyonu tamamlandı!',
    module: 'Code Studio',
    status: 'success'
  };
}

export default testModeFunction;`
              }
            ]
          };

          const duration = Date.now() - startTime;
          return res.json({
            success: true,
            data: mockPatch,
            metadata: {
              duration,
              operationCount: mockPatch.operations.length,
              fileCount: Object.keys(req.body.files || {}).length,
              testMode: true,
              fallbackReason: 'invalid_api_key'
            }
          });
        }
        
        return res.status(503).json({
          error: 'INVALID_API_KEY',
          message: 'Invalid API configuration'
        });
      }
      
      if (error.message.includes('rate limit')) {
        return res.status(429).json({
          error: 'OPENAI_RATE_LIMIT',
          message: 'Service temporarily busy. Please try again.'
        });
      }

      if (error.message.includes('AI response format is invalid')) {
        return res.status(422).json({
          error: 'AI_PARSE_ERROR',
          message: 'Failed to generate valid code changes. Please try rephrasing your request.'
        });
      }
    }
    
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    });
  }
});

export default router;
