# Efterbild

A fictional independent cinema with a Swedish film programme, original cinematic imagery and an interactive seat-selection demo.

**Visit the site:** https://themachineaiden.github.io/efterbild/

## Run locally

From the repository directory, run:

```sh
python3 -m http.server 4187 --bind 127.0.0.1
```

Open http://127.0.0.1:4187/. No build step or package installation is needed. Film details, programme filters and seat selection use JavaScript.

## The demo

All films, scenes and screening times are fictional. Select up to four example seats and view your selection. No tickets are sold or booked. Selections remain only in the current page and reset when another film is opened. The site has no analytics and collects no personal information.

## Assets and hosting

All fonts and images are served from this repository. See [PROVENANCE.txt](PROVENANCE.txt) for image attribution and font sources. The Anton font is distributed with its [SIL Open Font License](assets/Anton-OFL.txt).

GitHub Pages serves the static site from the root of the `main` branch. The `.nojekyll` file disables Jekyll processing.
