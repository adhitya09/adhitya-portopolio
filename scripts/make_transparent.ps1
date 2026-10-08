Add-Type -AssemblyName System.Drawing

$srcPath = "d:\adhitya-portopolio\public\logo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $bmp.Width
$height = $bmp.Height

$out = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $width; $x++) {
    for ($y = 0; $y -lt $height; $y++) {
        $p = $bmp.GetPixel($x, $y)
        # Check if the pixel is near-white background
        if ($p.R -gt 238 -and $p.G -gt 238 -and $p.B -gt 238) {
            $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            $out.SetPixel($x, $y, $p)
        }
    }
}

$bmp.Dispose()
$out.Save("d:\adhitya-portopolio\public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$out.Save("d:\adhitya-portopolio\public\images\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$out.Save("d:\adhitya-portopolio\app\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$out.Dispose()
Write-Output "Transparent logo successfully generated!"
