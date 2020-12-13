# @PelagicCreatures/Marlin

An ExpressJS CMS for sites with Sequelize db backends

This package implements a relational typed admin backend built from sequelize model definitions with granular access control for editing tables using ACLs for users and roles.

### Includes boilerplate implementation for:
* Material Design Availability
* Responsive design
* HIJAXed pages
* Data model driven database (sequelize)
* Complete User API (register, login, logout, email validation, password reset etc)
* Admin data editing UI suite automatically built from data model.
* ACL access control on tables by user role (superuser, admin, etc.)
* Ajax forms and unified input validation
* ReCaptcha v3 support for registration
* CSRF protection support
* Content Security Protocol support

See config/config-example for modules controls

See app-tests.js for an example express app using this module

See (https://github.com/PelagicCreatures/marlin-app)[boilerplate blog web app] for integration example.
