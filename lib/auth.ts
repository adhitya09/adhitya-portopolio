import fs from "fs"
import path from "path"
import nodemailer from "nodemailer"

const AUTH_FILE_PATH = path.join(process.cwd(), "data", "auth.json")

export interface AuthData {
  username: string
  password: string
  email: string
  resetCode?: string | null
  codeExpires?: number | null
}

export function getAuthData(): AuthData {
  try {
    if (fs.existsSync(AUTH_FILE_PATH)) {
      const file = fs.readFileSync(AUTH_FILE_PATH, "utf-8")
      return JSON.parse(file)
    }
  } catch (e) {
    console.error("Error reading auth data:", e)
  }
  return {
    username: "adhitya0989",
    password: "0989",
    email: "adhityahermawan0906@gmail.com",
    resetCode: null,
    codeExpires: null,
  }
}

export function saveAuthData(data: AuthData): boolean {
  try {
    const dir = path.dirname(AUTH_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(AUTH_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")
    return true
  } catch (e) {
    console.error("Error saving auth data:", e)
    return false
  }
}

export async function sendResetCodeEmail(toEmail: string, code: string) {
  // If SMTP environment variables are present, send real email.
  // Otherwise, fallback gracefully with test transporter or console log.
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS

  if (smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio CMS Security" <${smtpUser}>`,
      to: toEmail,
      subject: "Kode Verifikasi Reset Password CMS Portfolio",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #111827; margin-bottom: 8px;">Reset Password CMS Studio</h2>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Halo Adhitya,</p>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">Anda menerima email ini karena ada permintaan reset password untuk CMS Portfolio Anda.</p>
          <div style="margin: 24px 0; padding: 16px; background-color: #f3f4f6; border-radius: 8px; text-align: center;">
            <span style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">Kode Verifikasi Anda</span>
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #6b7280; font-size: 12px;">Kode ini berlaku selama 15 menit. Jika Anda tidak melakukan permintaan ini, abaikan email ini.</p>
        </div>
      `,
    })
    return { sent: true, method: "smtp" }
  }

  // Fallback simulation (still returns the code so user can complete reset in local/dev)
  console.log(`[RESET PASSWORD EMAIL SIMULATION] To: ${toEmail} | Code: ${code}`)
  return { sent: true, method: "mock" }
}
