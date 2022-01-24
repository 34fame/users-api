## Backlog

-  Integrate with service to handle payment (e.g. Stripe)
-  Charge based on number of users (5 for free)
-  Require email validation to create tenant
-  Developer can define apps. User can be restricted to an app.
-  Index in Algolia to add support for searching scoped to tenant or app

## Done

-  Add audit log events
-  Add error log events (all catch blocks)
-  Only 34 Fame can get all tenants
-  Secure delete tenant endpoint
-  Build test scripts
-  Secure update tenant endpoint
-  Prevent duplicate tenants based on email address
-  New tenant operation should also create first user

## Use Cases

### Email validation

- Submit new developer form
- Send email with activation code
- Get request with tenant and activation code will enable tenant