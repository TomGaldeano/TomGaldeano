# TomGaldeano Website Project Status

## 1. Overview
This project is a Flask-based personal website and portfolio with multiple sections, including personal content, games, and ordered/project showcases. The site acts as a personal landing page and experimentation space for web development, mini-games, and technical demos.

The current structure suggests a portfolio website with a mix of static educational content and interactive game pages.

## 2. Current website structure

### Main sections
- Home page
- Clock page
- Personal section
- Games section
- Ordered/projects section

### Current routes
- `/` → Home
- `/clock` → Clock page with date-related values
- `/personal` → Personal landing page
- `/personal/div_showcase` → CSS/layout showcase
- `/personal/built_in_api_showcase` → Browser API demo
- `/personal/operacionesBinarias` → Binary operations page
- `/personal/gestion` → Process management page
- `/personal/CssChallenges` → CSS challenge page
- `/games` → Games landing page
- `/games/sudoku`
- `/games/tresenraya`
- `/games/blackjack`
- `/games/buscaminas`
- `/games/adivinaNum`
- `/games/hexKingdom`
- `/games/obstacleRun`
- `/games/spaceInvaders`
- `/games/tute`
- `/games/solitaire`
- `/ordered` → Ordered projects landing page
- `/ordered/PracticaBackup`
- `/ordered/AzureSands`
- `/ordered/BananaTracker.html`

## 3. Current app architecture

### Stack
- Python
- Flask
- Flask-Bootstrap
- Flask-WTF/CSRF protection
- Jinja2 templates
- Static HTML/CSS/JS assets in template subfolders

### App setup
The app creates a Flask application in `create_app()` and initializes:
- `SECRET_KEY`
- CSRF protection
- Bootstrap support

The app runs with:
- host: `0.0.0.0`
- port: `5001`
- debug mode: enabled

## 4. Current feature set

### Personal section
Includes pages for:
- showcase layouts
- browser API demos
- computer systems content
- CSS exercises and examples

### Games section
Contains multiple browser-based mini-games, including:
- Sudoku
- Tic-Tac-Toe
- Blackjack
- Minesweeper
- Number guessing game
- Hex Kingdoms
- Obstacle run
- Space Invaders
- Tute
- Solitaire

### Ordered / project section
This section appears to host project pages or study work such as:
- backup practice project
- Azure Sands demo
- Banana Tracker

## 5. Current strengths
- Clear sectioned structure for content and features
- Diverse set of interactive examples and UI experiments
- Simple Flask routing model
- Good base for growing into a personal portfolio/project site
- Easy to add new pages and demos without major architectural changes

## 6. Current risks and limitations
- The app is a simple Flask app without a database layer
- There is no user authentication or persistent user data
- No leaderboard or scoring system is currently implemented
- Most game pages appear to be static HTML/JS demos rather than a shared game framework
- There is no centralized state management for game scores or player profiles
- The project may be difficult to scale without standardizing templates and shared assets

## 7. Suggested future upgrades

### 7.1 User functionality
Add user-centered features such as:
- user registration and login
- save favorite projects or pages
- persistent profile data
- user dashboards
- personal score history

### 7.2 Scores and leaderboard system
Suggested improvements:
- Track scores for each game
- Store top results in a database
- Create a global leaderboard
- Add user-specific achievements
- Show best scores per game and overall ranking

### 7.3 Game system improvements
- unify game logic under a shared architecture
- create reusable score handling utilities
- add session-based score tracking
- introduce difficulty levels and progression
- add sound effects and richer polish

### 7.4 Portfolio and project improvements
- add project descriptions and screenshots
- add tags and categories for each project
- add filtering and search for the project gallery
- add a more curated home page with featured content

### 7.5 Personal website improvements
- add a blog or notes section
- add contact form or social links
- improve responsive layout for mobile devices
- add improved visual hierarchy and branding
- create a cleaner home page with cards for sections

## 8. Recommended technical improvements

### High priority
- Add environment-based configuration for secrets
- Create a consistent template layout and shared navigation
- Add a database for persistent user profiles and score storage
- Standardize naming conventions between routes and template files
- Add tests for key routes and static pages

### Medium priority
- Add user auth and sessions
- Add leaderboard features
- Refactor repeated page patterns into shared components
- Improve accessibility and semantic HTML markup

### Long-term
- Add a CMS or admin dashboard for managing projects and articles
- Add analytics for user activity and most viewed sections
- Add multi-language support if the site expands beyond personal use

## 9. Suggested feature roadmap

### Phase 1: Foundation improvements
- Clean up route naming and template structure
- Add shared header/footer consistency
- Add environment configuration and secure app settings

### Phase 2: User and data features
- Add user accounts
- Add login/logout
- Add persistent score storage
- Add leaderboard pages

### Phase 3: Game experience enhancements
- Add score saving per user
- Add achievements and streaks
- Add difficulty settings
- Add challenge pages or timed modes

### Phase 4: Portfolio expansion
- Add richer project pages
- Add filter/search for personal and ordered content
- Add contact and social sections

## 10. Change log template
| Date | Change | Notes |
|------|--------|-------|
| TBD | Project status file created | Initial documentation |
| TBD | Add user authentication | Planned |
| TBD | Add persistent score tracking | Planned |
| TBD | Add leaderboard system | Planned |
| TBD | Improve responsive design | Planned |
| TBD | Add project filtering/search | Planned |

## 11. Final notes
This project is already a useful and visually varied personal site, but it is currently more of a collection of experiments and demos than a full product. The most valuable future upgrades are centered around user functionality, persistent score tracking, and a more polished portfolio experience.

This document should be updated whenever major features are added or when large site changes are made.
