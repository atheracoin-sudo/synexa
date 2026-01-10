import { Request, Response } from 'express';
import openaiClient from '../services/openaiClient';
import { authMiddleware } from '../middleware/authMiddleware';
import { Router } from 'express';

const router = Router();

const DESIGN_SYSTEM_PROMPT = `You are an expert UI/UX designer. Your job is to create design layouts based on user requests.

When given a design request, you should:
1. Understand the purpose and target audience
2. Choose appropriate colors, typography, and layout
3. Create a structured design with proper hierarchy
4. Generate specific design elements as JSON

IMPORTANT RULES:
- Always respond with valid JSON
- Use the exact format specified below
- Create visually appealing and balanced layouts
- Consider modern design principles (contrast, alignment, proximity, repetition)
- Use appropriate sizing and positioning
- Choose colors that work well together

Response format:
{
  "scene": {
    "width": number,
    "height": number,
    "background": "hex color",
    "nodes": [
      {
        "type": "text|rect|circle",
        "x": number,
        "y": number,
        "width": number,
        "height": number,
        "fill": "hex color",
        "stroke": "hex color (optional)",
        "strokeWidth": number (optional),
        "text": "string (for text nodes)",
        "fontSize": number (for text nodes),
        "fontFamily": "string (for text nodes)",
        "textAlign": "left|center|right (for text nodes)"
      }
    ]
  }
}

Node types:
- "text": Text elements with content, font size, and alignment
- "rect": Rectangular shapes with fill and optional stroke
- "circle": Circular shapes with fill and optional stroke

Create designs that are:
- Visually balanced and appealing
- Appropriate for the requested purpose
- Using modern color schemes
- Well-structured with clear hierarchy`;

interface DesignRequest {
  prompt: string;
  style?: string;
  width?: number;
  height?: number;
  workspaceId?: string;
}

interface DesignScene {
  scene: {
    width: number;
    height: number;
    background: string;
    nodes: Array<{
      type: 'text' | 'rect' | 'circle';
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      text?: string;
      fontSize?: number;
      fontFamily?: string;
      textAlign?: 'left' | 'center' | 'right';
    }>;
  };
}

// POST /design - Generate design layouts
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const startTime = Date.now();
    const userId = req.userId;

  try {
    console.log(`[Design] Request from userId: ${userId}`);

    const { prompt, style, width = 800, height = 600, workspaceId }: DesignRequest = req.body;

    // Validate request
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'Prompt is required and must be a string'
      });
    }

    // Build context for the AI
    const styleContext = style ? `\n\nDesign style: ${style}` : '';
    const dimensionsContext = `\n\nCanvas dimensions: ${width}x${height}`;
    
    const contextMessage = `Design request: ${prompt}${styleContext}${dimensionsContext}

Please create a design layout that fits these requirements and dimensions.`;

    console.log(`[Design] Calling OpenAI for userId: ${userId}, dimensions: ${width}x${height}`);

    // TEST MODE: Return mock response if in development or API key invalid
    if (process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_MODE === 'true') {
      console.log(`[Design] TEST MODE: Returning mock response for userId: ${userId}`);
      
      const mockScene = {
        scene: {
          width: width || 800,
          height: height || 600,
          background: "#f0f0f0",
          nodes: [
            {
              type: "rect",
              x: 50,
              y: 50,
              width: (width || 800) - 100,
              height: 80,
              fill: "#3b82f6",
              stroke: "#1e40af",
              strokeWidth: 2
            },
            {
              type: "text",
              x: (width || 800) / 2,
              y: 90,
              width: 300,
              height: 40,
              fill: "#ffffff",
              text: "Test Modu Aktif!",
              fontSize: 24,
              fontFamily: "Arial",
              textAlign: "center"
            },
            {
              type: "text",
              x: (width || 800) / 2,
              y: 200,
              width: 400,
              height: 60,
              fill: "#374151",
              text: `Backend entegrasyonu çalışıyor! "${prompt}" için mock tasarım`,
              fontSize: 16,
              fontFamily: "Arial",
              textAlign: "center"
            },
            {
              type: "circle",
              x: (width || 800) / 2 - 30,
              y: 300,
              width: 60,
              height: 60,
              fill: "#10b981",
              stroke: "#059669",
              strokeWidth: 3
            }
          ]
        }
      };

      const duration = Date.now() - startTime;
      console.log(`[Design] TEST MODE Success for userId: ${userId}, duration: ${duration}ms`);

      return res.json({
        success: true,
        data: mockScene,
        metadata: {
          duration,
          nodeCount: mockScene.scene.nodes.length,
          testMode: true
        }
      });
    }

    const completion = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: DESIGN_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: contextMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    let designScene: DesignScene;
    try {
      designScene = JSON.parse(response);
    } catch (parseError) {
      console.error('[Design] Failed to parse AI response:', response);
      throw new Error('AI response format is invalid');
    }

    // Validate design structure
    if (!designScene.scene || !Array.isArray(designScene.scene.nodes)) {
      throw new Error('Invalid design structure');
    }

    // Validate scene properties
    const scene = designScene.scene;
    if (typeof scene.width !== 'number' || typeof scene.height !== 'number') {
      throw new Error('Invalid scene dimensions');
    }

    // Validate nodes
    for (const node of scene.nodes) {
      if (!node.type || !['text', 'rect', 'circle'].includes(node.type)) {
        throw new Error('Invalid node type');
      }
      
      if (typeof node.x !== 'number' || typeof node.y !== 'number' ||
          typeof node.width !== 'number' || typeof node.height !== 'number') {
        throw new Error('Invalid node dimensions');
      }
      
      if (node.type === 'text' && !node.text) {
        throw new Error('Text node missing text content');
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[Design] Success for userId: ${userId}, duration: ${duration}ms, nodes: ${scene.nodes.length}`);

    res.json({
      success: true,
      data: designScene,
      metadata: {
        duration,
        nodeCount: scene.nodes.length,
        dimensions: { width: scene.width, height: scene.height }
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Design] Error for userId: ${userId}, duration: ${duration}ms:`, error);
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('API key')) {
        // TEST MODE: Return mock response for API key errors in development
        if (process.env.NODE_ENV === 'development' || process.env.ENABLE_TEST_MODE === 'true') {
          console.log(`[Design] TEST MODE: API key error, returning mock response for userId: ${userId}`);
          
          const mockScene = {
            scene: {
              width: req.body.width || 800,
              height: req.body.height || 600,
              background: "#fef3c7",
              nodes: [
                {
                  type: "rect",
                  x: 50,
                  y: 50,
                  width: (req.body.width || 800) - 100,
                  height: 100,
                  fill: "#f59e0b",
                  stroke: "#d97706",
                  strokeWidth: 3
                },
                {
                  type: "text",
                  x: (req.body.width || 800) / 2,
                  y: 100,
                  width: 400,
                  height: 50,
                  fill: "#ffffff",
                  text: "Design Studio Backend Entegrasyonu!",
                  fontSize: 20,
                  fontFamily: "Arial",
                  textAlign: "center"
                },
                {
                  type: "text",
                  x: (req.body.width || 800) / 2,
                  y: 200,
                  width: 500,
                  height: 80,
                  fill: "#92400e",
                  text: `Test modu ile çalışıyor! "${req.body.prompt || 'tasarım'}" isteği için mock yanıt.`,
                  fontSize: 16,
                  fontFamily: "Arial",
                  textAlign: "center"
                },
                {
                  type: "circle",
                  x: (req.body.width || 800) / 2 - 40,
                  y: 320,
                  width: 80,
                  height: 80,
                  fill: "#10b981",
                  stroke: "#059669",
                  strokeWidth: 4
                }
              ]
            }
          };

          const duration = Date.now() - startTime;
          return res.json({
            success: true,
            data: mockScene,
            metadata: {
              duration,
              nodeCount: mockScene.scene.nodes.length,
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
          message: 'Failed to generate valid design. Please try rephrasing your request.'
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
