<?php

function createPwaIcon($size, $isMaskable, $outputPath) {
    $img = imagecreatetruecolor($size, $size);
    imagealphablending($img, true);
    imagesavealpha($img, true);

    // Fill with transparent initially
    $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
    imagefill($img, 0, 0, $transparent);

    // Center and scaling
    $center = $size / 2;
    $radius = $size * 0.44; // for rounded rect corner or safe area

    // Draw gradient background
    // Gradient from top-left (amber #fbbf24) to bottom-right (orange #c2410c)
    $cTop = [251, 191, 36];     // #fbbf24
    $cMid = [245, 158, 11];     // #f59e0b
    $cBot = [217, 119, 6];      // #d97706
    $cDeep = [194, 65, 12];     // #c2410c

    $cornerRadius = $isMaskable ? 0 : ($size * 0.22);

    for ($y = 0; $y < $size; $y++) {
        for ($x = 0; $x < $size; $x++) {
            // Check rounded corner mask if not maskable
            if (!$isMaskable) {
                $dx = 0;
                $dy = 0;
                if ($x < $cornerRadius) $dx = $cornerRadius - $x;
                elseif ($x >= $size - $cornerRadius) $dx = $x - ($size - $cornerRadius - 1);
                
                if ($y < $cornerRadius) $dy = $cornerRadius - $y;
                elseif ($y >= $size - $cornerRadius) $dy = $y - ($size - $cornerRadius - 1);
                
                if ($dx > 0 && $dy > 0) {
                    $dist = sqrt($dx * $dx + $dy * $dy);
                    if ($dist > $cornerRadius) {
                        continue; // Outside rounded corner
                    }
                }
            }

            // Diagonal gradient ratio: 0.0 at (0,0), 1.0 at ($size, $size)
            $ratio = ($x + $y) / ($size * 2);
            
            // Subtle radial darkening from center for depth
            $radialDist = sqrt(pow($x - $center, 2) + pow($y - $center, 2)) / ($size * 0.707);
            
            if ($ratio < 0.5) {
                $subRatio = $ratio / 0.5;
                $r = (int)($cTop[0] + ($cMid[0] - $cTop[0]) * $subRatio);
                $g = (int)($cTop[1] + ($cMid[1] - $cTop[1]) * $subRatio);
                $b = (int)($cTop[2] + ($cMid[2] - $cTop[2]) * $subRatio);
            } else {
                $subRatio = ($ratio - 0.5) / 0.5;
                $r = (int)($cMid[0] + ($cDeep[0] - $cMid[0]) * $subRatio);
                $g = (int)($cMid[1] + ($cDeep[1] - $cMid[1]) * $subRatio);
                $b = (int)($cMid[2] + ($cDeep[2] - $cMid[2]) * $subRatio);
            }

            // Apply slight radial lighting
            $r = max(0, min(255, (int)($r * (1.05 - 0.15 * $radialDist))));
            $g = max(0, min(255, (int)($g * (1.05 - 0.15 * $radialDist))));
            $b = max(0, min(255, (int)($b * (1.05 - 0.15 * $radialDist))));

            $col = imagecolorallocate($img, $r, $g, $b);
            imagesetpixel($img, $x, $y, $col);
        }
    }

    // Enable antialiasing
    imageantialias($img, true);

    // Decorative outer thin circle
    $ringColor = imagecolorallocatealpha($img, 255, 255, 255, 95); // semi-transparent white
    imagesetthickness($img, max(1, (int)($size * 0.008)));
    imagearc($img, (int)$center, (int)$center, (int)($size * 0.82), (int)($size * 0.82), 0, 360, $ringColor);

    // Colors for tree icon
    $white = imagecolorallocate($img, 255, 255, 255);
    $shadowColor = imagecolorallocatealpha($img, 124, 45, 18, 70); // brown-amber shadow

    // Draw the family tree icon!
    // Scale factor: inside maskable, tree is ~50% of canvas; if normal, ~56%
    $treeScale = $isMaskable ? ($size / 48) : ($size / 42);
    $treeOffsetX = $center - ($treeScale * 12);
    $treeOffsetY = $center - ($treeScale * 12);

    $strokeW = max(2, (int)round($treeScale * 1.8));
    imagesetthickness($img, $strokeW);

    // Helper function to draw thick antialiased line
    $drawLine = function($x1, $y1, $x2, $y2, $color) use ($img, $treeScale, $treeOffsetX, $treeOffsetY) {
        $px1 = (int)round($treeOffsetX + $x1 * $treeScale);
        $py1 = (int)round($treeOffsetY + $y1 * $treeScale);
        $px2 = (int)round($treeOffsetX + $x2 * $treeScale);
        $py2 = (int)round($treeOffsetY + $y2 * $treeScale);
        imageline($img, $px1, $py1, $px2, $py2, $color);
    };

    $drawCircle = function($cx, $cy, $r, $color, $fill = true) use ($img, $treeScale, $treeOffsetX, $treeOffsetY) {
        $pcx = (int)round($treeOffsetX + $cx * $treeScale);
        $pcy = (int)round($treeOffsetY + $cy * $treeScale);
        $pr = (int)round($r * $treeScale * 2);
        if ($fill) {
            imagefilledellipse($img, $pcx, $pcy, $pr, $pr, $color);
        } else {
            imageellipse($img, $pcx, $pcy, $pr, $pr, $color);
        }
    };

    // Draw Left Tree (Deciduous / Cloud-shaped Family Tree)
    // Left trunk: x=7, y=14 to 22
    $drawLine(7, 14, 7, 22, $white);
    // Left roots
    $drawLine(7, 22, 5, 23, $white);
    $drawLine(7, 22, 9, 23, $white);

    // Left tree canopy (cloud circles)
    $drawCircle(5.5, 12.5, 2.8, $white);
    $drawCircle(8.5, 12.5, 2.8, $white);
    $drawCircle(7, 9.5, 3.2, $white);

    // Inner detail in left tree canopy
    $amberInner = imagecolorallocate($img, 245, 158, 11);
    $drawCircle(7, 10.5, 1.3, $amberInner);

    // Draw Right Tree (Pine / Evergreen Branched Family Tree)
    // Right trunk: x=17, y=14 to 22
    $drawLine(17, 14, 17, 22, $white);
    // Right roots
    $drawLine(17, 22, 15, 23, $white);
    $drawLine(17, 22, 19, 23, $white);

    // Right tree tiers (3 tiers of evergreen branching)
    // Tier 1 (bottom)
    $drawLine(17, 11.5, 12, 15.5, $white);
    $drawLine(17, 11.5, 22, 15.5, $white);
    $drawLine(12, 15.5, 22, 15.5, $white);

    // Tier 2 (middle)
    $drawLine(17, 7.5, 13.5, 11.5, $white);
    $drawLine(17, 7.5, 20.5, 11.5, $white);
    $drawLine(13.5, 11.5, 20.5, 11.5, $white);

    // Tier 3 (top peak)
    $drawLine(17, 3.5, 15, 7.5, $white);
    $drawLine(17, 3.5, 19, 7.5, $white);
    $drawLine(15, 7.5, 19, 7.5, $white);

    // Small family connection arch bridging both trees at the ground
    $groundY = 22;
    $drawLine(3, $groundY, 21, $groundY, imagecolorallocatealpha($img, 255, 255, 255, 60));

    // Save PNG
    imagepng($img, $outputPath, 9);
    imagedestroy($img);
    echo "Generated $outputPath ($size x $size)\n";
}

$sizes = [
    ['size' => 512, 'maskable' => false, 'file' => 'public/icons/icon-512x512.png'],
    ['size' => 512, 'maskable' => true,  'file' => 'public/icons/icon-maskable-512x512.png'],
    ['size' => 192, 'maskable' => false, 'file' => 'public/icons/icon-192x192.png'],
    ['size' => 192, 'maskable' => true,  'file' => 'public/icons/icon-maskable-192x192.png'],
    ['size' => 180, 'maskable' => false, 'file' => 'public/icons/icon-180x180.png'],
    ['size' => 180, 'maskable' => false, 'file' => 'public/icons/apple-touch-icon.png'],
    ['size' => 152, 'maskable' => false, 'file' => 'public/icons/icon-152x152.png'],
    ['size' => 144, 'maskable' => false, 'file' => 'public/icons/icon-144x144.png'],
    ['size' => 128, 'maskable' => false, 'file' => 'public/icons/icon-128x128.png'],
    ['size' => 96,  'maskable' => false, 'file' => 'public/icons/icon-96x96.png'],
    ['size' => 72,  'maskable' => false, 'file' => 'public/icons/icon-72x72.png'],
    ['size' => 32,  'maskable' => false, 'file' => 'public/icons/favicon-32x32.png'],
    ['size' => 16,  'maskable' => false, 'file' => 'public/icons/favicon-16x16.png'],
];

if (!is_dir('public/icons')) {
    mkdir('public/icons', 0755, true);
}

foreach ($sizes as $s) {
    createPwaIcon($s['size'], $s['maskable'], $s['file']);
}

// Also overwrite public/apple-touch-icon.png
copy('public/icons/apple-touch-icon.png', 'public/apple-touch-icon.png');
echo "Done!\n";
