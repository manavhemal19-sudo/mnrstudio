WHAT'S IN HERE
================
index-14-bts-muted-2.html
  Your website file, with the Electric Embroidered Set product entry
  updated to reference all 6 photos + 2 videos below (previously it only
  pointed at 3 files that didn't exist at all).

ElectricEmbroideredSet-1.webp   standing, full back turn
ElectricEmbroideredSet-2.webp   sitting at the cafe table, back/side
ElectricEmbroideredSet-3.webp   umbrella photo 1
ElectricEmbroideredSet-4.webp   umbrella photo 2
ElectricEmbroideredSet-5.webp   standing, back/side, arm raised
ElectricEmbroideredSet-6.webp   standing, front, dancing pose
ElectricEmbroideredSet-video-1.mp4   first video
ElectricEmbroideredSet-video-2.mp4   second video

HOW TO DEPLOY
================
All 9 files go FLAT into the same folder as your other site assets on
Netlify (the same place hero-poster.jpg / hero-video.mp4 already live) —
NOT in a subfolder. The website code references these by bare filename
(e.g. 'ElectricEmbroideredSet-1.webp'), so if they're inside a subfolder
the browser won't find them.

Upload/replace index-14-bts-muted-2.html at the same time as the 8 asset
files, since the HTML is what actually points to these exact filenames.

WHY THE OLD FOLDER WOULDN'T HAVE WORKED
================
The site's code had this hardcoded for the product BEFORE this fix:
  images: ['ElectricEmbroideredSet-1.jpg', '-2.jpg', '-3.jpg']
Three flat files, .jpg only, sitting next to index.html. Dropping in a
subfolder named "Electric Embroidered Set" with 01-06 + webp/jpg pairs
didn't match that pattern at all — right instinct on your part to check
first instead of just uploading it.
