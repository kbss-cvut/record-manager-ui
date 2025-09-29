# Security

## Table of Contents

- [Authentication and Authorization](#authentication-and-authorization)
  - [Internal (Session-Based)](#internal-session-based)
  - [OAuth2 / Keycloak (Token-Based)](#oauth2--keycloak-token-based)
- [Roles](#roles)
- [Role Groups](#role-groups)
- [Roles and Role Groups Configuration](#roles-and-role-groups-configuration)
- [User Hierarchy](#user-hierarchy)
- [Impersonation](#impersonation)
- [Differences Between Internal and Keycloak Authorization](#differences-between-internal-and-keycloak-authorization)

Record Manager supports two types of authentication and authorization mechanisms.
Each mechanism has its own sample Docker Compose deployment configuration in the [deploy](../deploy) directory.

## Authentication and Authorization

### Internal (Session-Based)

- **Authentication:**  
  Users log in via a login form (`/login`). Spring Security validates credentials and creates a session (`JSESSIONID`) to track the user.

- **Authorization:**  
  After successful authentication, Spring Security retrieves roles from the session.
  Method-level security annotations, such as `@PreAuthorize`, control access to specific actions based on these roles.

### OAuth2 / Keycloak (Token-Based)

- **Authentication:**  
  Users authenticate through **Keycloak**, which issues a JWT access token containing user details and roles.
  Each backend request must include this token in the `Authorization` header. Spring Security validates the token to verify the user’s identity.

- **Authorization:**  
  Roles are extracted from the Keycloak JWT token and mapped to Spring Security authorities.
  Access to endpoints is controlled using method-level `@PreAuthorize` annotations, based on the extracted roles.

## Roles

Roles define the actions a user can perform. Each role is represented as a string (authority) in Spring Security, determining the user’s permissions.

## Role Groups

Role Groups are collections of roles designed to simplify assigning predefined sets of roles to users. For the deployments within [deploy](../deploy) directory,
a list of Role Groups and their associated roles was configured as shown in [roles-and-role-groups.md](roles-and-role-groups.md).

## Roles and Role Groups Configuration

1. **Internal Authentication and Authorization:**  
   Roles and Role Groups are imported during the initial startup via a [configuration file](../deploy/internal-auth/db-server/import/record-manager-app/role-groups.trig).

2. **Keycloak Authentication and Authorization:**  
   Keycloak is configured with roles and Role Groups using a [configuration file](../deploy/keycloak-auth/auth-server/realm-export.json).

## Role-based Hierarchy of Users

We do not have roles that would differentiate between write privileges to user attributes and write privileges to the set of roles assigned to the user (e.g., role `write-all-users` can modify both the user's email address and the user's roles).
As a consequence of this design decision, we built security over the relation `has-higher-or-equal-privileges`, where u1 `has-higher-or-equal-privileges` u2 if u1's roles are a superset of u2's roles.
A user (u1) can modify another user (u2) if u1 `has-higher-or-equal-privileges-than` u2 and one of the following conditions is met:

- u1 and u2 are the same user.
- u1 has the `write-organization-users` role, and both u1 and u2 belong to the same organization.
- u1 has the `write-all-users` role.

Note that the relation `has-higher-or-equal-privileges-than` naturally induces equivalence classes of users: all users with the same role set are equivalent in terms of privileges.
These equivalence classes correspond directly to elements of the _Hierarchy of Role Sets_ — the power set lattice of all roles, ordered by subsumption (set inclusion), where:

- The **top element** of this lattice is the full role set, representing maximal privileges.
- The **bottom element** is the empty role set, representing no privileges.
- Each user maps uniquely to one element of this hierarchy, determined by the set of roles assigned to them.

## Impersonation

Impersonation allows a user (u1) to act as another user (u2) by signing into their profile. This is permitted if the following conditions are met:

- u1 has the `impersonate` role.
- u1 `has-higher-or-equal-privileges-than` u2.

When impersonation occurs, the impersonated field for u2 is set to true, and this status is visible in the frontend, indicating that the user is being impersonated.

## Current limitations

- With internal authorization, the user’s Role Group and associated roles are stored in GraphDB. In contrast, with Keycloak authorization,
  roles are extracted directly from the JWT token for each request. As a result, Role Groups and roles are not visible in the Record Manager UI when using Keycloak,
  as they are managed exclusively within the Keycloak system.
- The current implementation does not support having multiple role groups assigned to a single user in internal authorization. Each user can only be associated with one role group at a time.
  On the other hand, in keycloak authorization, users can be assigned multiple role groups. It is possible, because each time a user logs in, the roles are extracted from the JWT token, which are inherited from role groups,
  and Record Manager creates a blank role group with the extracted roles for the duration of the session.
- Only users with higher or equal privileges can change the privileges of another user, as explained in the [User Hierarchy](#user-hierarchy) section.
  This means that a user cannot elevate another user's privileges beyond their own.
