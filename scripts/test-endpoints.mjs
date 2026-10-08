async function runTests() {
  console.log("=== 1. Testing Homepage (http://localhost:3000) ===")
  const resHome = await fetch("http://localhost:3000")
  const textHome = await resHome.text()
  console.log("Home Status:", resHome.status)
  console.log("Has CMS link on live site:", textHome.includes("CMS ⚙"))
  console.log("Has GitHub link:", textHome.includes("github.com/adhitya09"))
  console.log("Has Instagram link:", textHome.includes("adhityah_09"))
  console.log("Has Education section:", textHome.includes("education"))
  console.log("Has Selengkapnya button text:", textHome.includes("Selengkapnya"))
  console.log("Has My Approach (should be false):", textHome.includes("My Approach"))

  console.log("\n=== 2. Testing ATS CV Page (http://localhost:3000/cv) ===")
  const resCv = await fetch("http://localhost:3000/cv")
  const textCv = await resCv.text()
  console.log("CV Status:", resCv.status)
  console.log("Has PROFESSIONAL SUMMARY:", textCv.includes("PROFESSIONAL SUMMARY"))
  console.log("Has Print Button:", textCv.includes("Cetak / Simpan PDF"))

  console.log("\n=== 3. Testing CMS Login (/api/auth/login) ===")
  const resLogin = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "adhitya0989", password: "0989" }),
  })
  const jsonLogin = await resLogin.json()
  console.log("Login Status:", resLogin.status)
  console.log("Login Success:", jsonLogin.success)
  console.log("Login Token Present:", Boolean(jsonLogin.token))

  console.log("\n=== 4. Testing Forgot Password Request (/api/auth/forgot-password) ===")
  const resForgot = await fetch("http://localhost:3000/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "adhityahermawan0906@gmail.com" }),
  })
  const jsonForgot = await resForgot.json()
  console.log("Forgot Password Status:", resForgot.status)
  console.log("Forgot Password Success:", jsonForgot.success)
  console.log("Target Email:", jsonForgot.targetEmail)
  console.log("Generated Code:", jsonForgot.devCode)

  if (jsonForgot.devCode) {
    console.log("\n=== 5. Testing Reset Password Confirmation (/api/auth/reset-password) ===")
    const resReset = await fetch("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: jsonForgot.devCode, newPassword: "0989" }),
    })
    const jsonReset = await resReset.json()
    console.log("Reset Password Success:", jsonReset.success)
    console.log("Reset Password Message:", jsonReset.message)
  }

  console.log("\n=== 6. Testing Translate API (/api/translate) ===")
  const resTrans = await fetch("http://localhost:3000/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts: "Saya seorang perekayasa perangkat lunak", target: "en", source: "id" }),
  })
  const jsonTrans = await resTrans.json()
  console.log("Translate Success:", jsonTrans.success)
  console.log("Translation Result:", jsonTrans.translation)

  console.log("\n=== 7. Testing Secret Route (/studio-adhitya) ===")
  const resStudio = await fetch("http://localhost:3000/studio-adhitya")
  console.log("Secret Route Status:", resStudio.status)

  console.log("\nALL VERIFICATIONS COMPLETE!")
}

runTests().catch(console.error)
