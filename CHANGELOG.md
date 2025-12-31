# Changelog

## [UPCOMING] - TODO

- //not even working on mac
- dragging on mac
- transparency on mac
- create web app 
- maybe hide time indicator when on other day?
- a way to duplicate sessions or a duplicate day, or something
- logo of installer & installer customization
- //make dropdown autocomplete --> I think use comboxbox for activities.. not sure about this one
- a way to Plan sessions tasks
- add a built-in changelog view...
- rename fitness to health & change icon //will require huge changes in db and stuff.. i will not do it...


## [v0.9.1] - 2025-12-31 

### Added
- You can now DUPLICATE TASKS!, in the tasks section if you middle mouse a task it will be duplicated.
- You can now UN-COMPLETE TASKS!, in the tasks section if you right click a task it will be undone.
- Added min size to the window.

### Fixed
- Fixed Typo in ReadMe.
- Fixed an Issue in Mac Signing Configuration.
- Fixed monthly goals progress in other carousal tab.
- Fixed deleting & uncompleting tasks will update the monthly goals progress accordingly.

### Changed
- Updated session preview when there is no goal to show "No Goal" instead of being blank.
- Removed app-drag utility class and used tauri built in data attribute [data-tauri-drag-region], should fix issues in macos hopefully.
- Tried to Enhance the usability of the switch days in the app header... still sucks.

## [v0.9.0] - 2025-10-24 

### Added
- Added summary card when visiting past days.

### Fixed
- Enhanced saving doodles as pngs, mapped --foreground color to black.
- Tasks isToday was not mapped from 0,1 to boolean when fetching from sqlite database.
- Removed border from app because it was leading to weird rendering results.
- Backlog goals was not scrollable.
- Goals listing when the title of the goal is long it didn't show the goal points.

### Changed
- Changed target es to es2021.
- made active task more readable in now view.
- Increased activities circle digram thickness from 4 to 6 for better visibility.


## [v0.8.0] - 2025-10-16

### Added
- New `Focus mode` was added. You can now enable focus mode for a session by clicking the focus mode button in the Now Card. This will hide all the other cards/widgets and only allow core functionality to focus in the active session and its tasks.

### Fixed
- Updated styling of note text editor, better support for dark mode.
- Fixed listing of tasks when looking at previous days, it now only shows the completed ones for the selected day.
- Update animation in tasks list in now card to use Transition group instead of auto-animate, Transition groups have been more reliable and leads to less weirder results.

### Changed
- You can now see the completed tasks of sessions in the session preview popup. 
- You can now set tasks to active session directly from the tasks list by `alt + primary click`, if the task activity matches the current active session activity it will automatically be assigned to that session. 


## [v0.7.3] - 2025-10-15

`Initial Release`
