export interface EmailTemplate {
  id: string
  subject: string
  htmlContent: string
  textContent: string
  category: 'weekly_summary' | 'reminder' | 'product_update' | 'welcome'
}

export interface EmailNotificationData {
  userId: string
  email: string
  name: string
  unsubscribeToken: string
  data: Record<string, any>
}

export class EmailNotificationService {
  private static instance: EmailNotificationService

  static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService()
    }
    return EmailNotificationService.instance
  }

  // Email templates
  private templates: Record<string, EmailTemplate> = {
    weekly_summary: {
      id: 'weekly_summary',
      subject: 'Bu hafta Synexa ile neler yaptın? 📊',
      htmlContent: this.getWeeklySummaryHTML(),
      textContent: this.getWeeklySummaryText(),
      category: 'weekly_summary'
    },
    inactive_reminder: {
      id: 'inactive_reminder',
      subject: 'Synexa\'da seni özledik 👋',
      htmlContent: this.getInactiveReminderHTML(),
      textContent: this.getInactiveReminderText(),
      category: 'reminder'
    },
    new_features: {
      id: 'new_features',
      subject: 'Yeni özellikler Synexa\'da! ✨',
      htmlContent: this.getNewFeaturesHTML(),
      textContent: this.getNewFeaturesText(),
      category: 'product_update'
    },
    welcome: {
      id: 'welcome',
      subject: 'Synexa\'ya hoş geldin! 🚀',
      htmlContent: this.getWelcomeHTML(),
      textContent: this.getWelcomeText(),
      category: 'welcome'
    }
  }

  // Send email notification (simulated)
  async sendEmailNotification(templateId: string, data: EmailNotificationData): Promise<boolean> {
    const template = this.templates[templateId]
    if (!template) {
      console.error(`Email template ${templateId} not found`)
      return false
    }

    // Check if user has email notifications enabled
    const settings = this.getUserEmailSettings(data.userId)
    if (!settings.enabled) {
      console.log('Email notifications disabled for user')
      return false
    }

    // Check if category is enabled
    if (!settings.categories[template.category]) {
      console.log(`Email category ${template.category} disabled for user`)
      return false
    }

    // In a real app, this would send via email service (SendGrid, AWS SES, etc.)
    console.log('📧 Email sent:', {
      to: data.email,
      subject: this.replacePlaceholders(template.subject, data),
      template: templateId,
      data: data.data
    })

    // Log email sent
    this.logEmailSent(data.userId, templateId)
    
    return true
  }

  // Get user email settings
  private getUserEmailSettings(userId: string) {
    try {
      const settings = JSON.parse(localStorage.getItem(`synexa_notification_settings_${userId}`) || '{}')
      return {
        enabled: settings.email || false,
        categories: {
          weekly_summary: settings.categories?.reminder !== false,
          reminder: settings.categories?.reminder !== false,
          product_update: settings.categories?.updates !== false,
          welcome: true // Always enabled
        }
      }
    } catch (error) {
      return {
        enabled: false,
        categories: {
          weekly_summary: false,
          reminder: false,
          product_update: false,
          welcome: true
        }
      }
    }
  }

  // Replace placeholders in template
  private replacePlaceholders(content: string, data: EmailNotificationData): string {
    let result = content
    result = result.replace(/\{name\}/g, data.name)
    result = result.replace(/\{email\}/g, data.email)
    
    // Replace custom data placeholders
    Object.entries(data.data || {}).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
    })
    
    return result
  }

  // Log email sent for rate limiting
  private logEmailSent(userId: string, templateId: string): void {
    const key = `synexa_email_log_${userId}`
    const log = JSON.parse(localStorage.getItem(key) || '[]')
    
    log.push({
      templateId,
      sentAt: new Date().toISOString()
    })
    
    // Keep only last 50 emails
    if (log.length > 50) {
      log.splice(0, log.length - 50)
    }
    
    localStorage.setItem(key, JSON.stringify(log))
  }

  // Check if we can send email (rate limiting)
  canSendEmail(userId: string, templateId: string): boolean {
    const key = `synexa_email_log_${userId}`
    const log = JSON.parse(localStorage.getItem(key) || '[]')
    
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    // Check daily limits
    const todayEmails = log.filter((entry: any) => 
      new Date(entry.sentAt) > oneDayAgo
    ).length
    
    if (todayEmails >= 2) { // Max 2 emails per day
      return false
    }
    
    // Check weekly summary limit (once per week)
    if (templateId === 'weekly_summary') {
      const weeklyEmails = log.filter((entry: any) => 
        entry.templateId === 'weekly_summary' && new Date(entry.sentAt) > oneWeekAgo
      ).length
      
      if (weeklyEmails >= 1) {
        return false
      }
    }
    
    return true
  }

  // Generate weekly summary
  generateWeeklySummary(userId: string): any {
    try {
      const analytics = JSON.parse(localStorage.getItem(`synexa_analytics_${userId}`) || '{}')
      const conversations = JSON.parse(localStorage.getItem(`synexa_conversations_${userId}`) || '[]')
      
      const thisWeek = new Date()
      thisWeek.setDate(thisWeek.getDate() - 7)
      
      const weeklyChats = conversations.filter((conv: any) => 
        new Date(conv.createdAt) > thisWeek
      ).length
      
      return {
        chatMessages: analytics.usageMetrics?.chatMessages || 0,
        codeProjects: analytics.usageMetrics?.codeProjects || 0,
        imageDesigns: analytics.usageMetrics?.imageDesigns || 0,
        weeklyChats,
        mostProductiveDay: analytics.mostProductiveDay || 'Pazartesi'
      }
    } catch (error) {
      return {
        chatMessages: 0,
        codeProjects: 0,
        imageDesigns: 0,
        weeklyChats: 0,
        mostProductiveDay: 'Pazartesi'
      }
    }
  }

  // Email template HTML generators
  private getWeeklySummaryHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Haftalık Özet - Synexa</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f0f23; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: white; margin-bottom: 10px; }
        .stats { background: #1a1a2e; border-radius: 12px; padding: 30px; margin: 20px 0; }
        .stat-item { display: inline-block; text-align: center; margin: 10px 20px; }
        .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
        .stat-label { font-size: 14px; color: #888; margin-top: 5px; }
        .cta { text-align: center; margin: 30px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
        .unsubscribe { color: #888; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">✨ Synexa</div>
            <h1>Bu hafta harika işler yaptın!</h1>
        </div>
        
        <div class="stats">
            <h2>📊 Bu hafta özet:</h2>
            <div class="stat-item">
                <div class="stat-number">{chatMessages}</div>
                <div class="stat-label">Chat mesajı</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{codeProjects}</div>
                <div class="stat-label">Kod projesi</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{imageDesigns}</div>
                <div class="stat-label">Tasarım</div>
            </div>
            
            <p style="margin-top: 30px;">
                🚀 En üretken günün: <strong>{mostProductiveDay}</strong>
            </p>
        </div>
        
        <div class="cta">
            <a href="https://synexa.ai/chat" class="button">Devam Et</a>
        </div>
        
        <div class="footer">
            <p>Bu e-posta Synexa AI Studio tarafından gönderildi.</p>
            <a href="https://synexa.ai/unsubscribe?token={unsubscribeToken}" class="unsubscribe">Abonelikten çık</a>
        </div>
    </div>
</body>
</html>
    `
  }

  private getWeeklySummaryText(): string {
    return `
Merhaba {name},

Bu hafta Synexa ile harika işler yaptın! 🚀

📊 Bu hafta özet:
- {chatMessages} chat mesajı
- {codeProjects} kod projesi  
- {imageDesigns} tasarım

En üretken günün: {mostProductiveDay}

Devam etmek için: https://synexa.ai

---
Bu e-posta Synexa AI Studio tarafından gönderildi.
Abonelikten çıkmak için: https://synexa.ai/unsubscribe?token={unsubscribeToken}
    `
  }

  private getInactiveReminderHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Seni Özledik - Synexa</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f0f23; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; }
        .content { background: #1a1a2e; border-radius: 12px; padding: 30px; text-align: center; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👋 Merhaba {name},</h1>
        </div>
        
        <div class="content">
            <h2>Bir süredir görüşemedik!</h2>
            <p>Synexa'da seni bekliyoruz. Devam etmek ister misin?</p>
            
            <a href="https://synexa.ai/chat" class="button">Devam Et</a>
            
            <p style="margin-top: 30px; font-size: 14px; color: #888;">
                Yeni özellikler ve iyileştirmeler seni bekliyor.
            </p>
        </div>
    </div>
</body>
</html>
    `
  }

  private getInactiveReminderText(): string {
    return `
Merhaba {name},

Bir süredir görüşemedik! 👋

Synexa'da seni bekliyoruz. Devam etmek ister misin?

https://synexa.ai/chat

Yeni özellikler ve iyileştirmeler seni bekliyor.
    `
  }

  private getNewFeaturesHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Yeni Özellikler - Synexa</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f0f23; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .feature { background: #1a1a2e; border-radius: 12px; padding: 20px; margin: 15px 0; }
        .feature-icon { font-size: 24px; margin-bottom: 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✨ Yeni özellikler Synexa'da!</h1>
        
        <div class="feature">
            <div class="feature-icon">🤖</div>
            <h3>AI Agents</h3>
            <p>Uzman AI asistanları artık kullanılabilir.</p>
        </div>
        
        <div class="feature">
            <div class="feature-icon">👥</div>
            <h3>Team Workspace</h3>
            <p>Takım halinde çalışın, projeleri paylaşın.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://synexa.ai" class="button">Keşfet</a>
        </div>
    </div>
</body>
</html>
    `
  }

  private getNewFeaturesText(): string {
    return `
✨ Yeni özellikler Synexa'da!

🤖 AI Agents
Uzman AI asistanları artık kullanılabilir.

👥 Team Workspace  
Takım halinde çalışın, projeleri paylaşın.

Keşfetmek için: https://synexa.ai
    `
  }

  private getWelcomeHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hoş Geldin - Synexa</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f0f23; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; margin-bottom: 30px; }
        .content { background: #1a1a2e; border-radius: 12px; padding: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 10px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Synexa'ya hoş geldin!</h1>
            <p>AI ile üretkenliğin artık sınırsız.</p>
        </div>
        
        <div class="content">
            <h2>Neler yapabilirsin?</h2>
            
            <p>💬 <strong>Chat:</strong> AI ile sohbet et, sorular sor</p>
            <p>💻 <strong>Code Studio:</strong> Uygulama oluştur, kod yaz</p>
            <p>🎨 <strong>Image Studio:</strong> Tasarım yap, görseller oluştur</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://synexa.ai/chat" class="button">Sohbete Başla</a>
                <a href="https://synexa.ai/studio/code" class="button">Kod Yaz</a>
            </div>
        </div>
    </div>
</body>
</html>
    `
  }

  private getWelcomeText(): string {
    return `
🚀 Synexa'ya hoş geldin!

AI ile üretkenliğin artık sınırsız.

Neler yapabilirsin?

💬 Chat: AI ile sohbet et, sorular sor
💻 Code Studio: Uygulama oluştur, kod yaz  
🎨 Image Studio: Tasarım yap, görseller oluştur

Başlamak için: https://synexa.ai
    `
  }
}

// Export singleton instance
export const emailNotificationService = EmailNotificationService.getInstance()








