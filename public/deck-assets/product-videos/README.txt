MediMind product-demo clips for the Healthycore deck "THE PLATFORM" slide.

Drop short (~20-40s) MP4 recordings here using these EXACT filenames. Each
product card on the platform slide opens the matching file in a popup. Until a
file exists, the popup shows a graceful "Demo recording coming soon" placeholder
(no broken player), so you can add them one at a time.

  os.mp4          MediMind OS (the hospital operating system)
  connect.mp4     MediMind Connect (telemedicine marketplace)
  pacs.mp4        MediMind PACS (DICOM imaging)
  lab.mp4         MediMind Lab (laboratory)
  portal.mp4      MediMind Patient Portal
  liverra.mp4     LiverRa (liver surgical AI)
  angio.mp4       MediMind Angio (vascular reporting)
  structural.mp4  MediMind Structural (TAVI / structural-heart planning)

Tips: H.264 MP4, 1280x720 or 1920x1080, ~5-10 MB each plays best. These are
served from /deck-assets/* which Netlify caches immutably (see netlify.toml).
