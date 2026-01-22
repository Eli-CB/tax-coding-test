# Tax Test Application

A NestJS application for managing user profiles and tracking their activities in tax-related projects.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tax-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

4. Access the UI:
   - Open your browser to `http://localhost:3000/index.html`

### Running Tests

```bash
# Run all tests (unit + e2e)
npm run test:all

# Run unit tests only
npm test

# Run e2e tests only
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## Architecture & Design Decisions

### Core Requirements Interpretation

The application addresses three primary objectives:

1. **User Management**: CRUD operations for user profiles
2. **Activity Tracking**: CRUD operations for user activities with a one-to-many relationship
3. **Activity Filtering**: Filter activities by user, type, and date
4. **Data Persistence**: SQLite database with TypeORM

### Data Model

The application uses a straightforward relational model:
- **Users** have a one-to-many relationship with **Activities**
- Both entities are uniquely identified by auto-generated IDs
- Activities support four types: `meeting_participation`, `document_submission`, `login`, `logout`

### Key Assumptions

- **User Data**: emails and names are required but not validated, emails are not unique
- **Activity Dates**: User-selectable (including future dates), not automatically set to current timestamp
- **Security**: No authentication/authorization implemented (development/demo environment)
- **Data Integrity**: Users cannot be deleted if they have associated activities
- **Activity Transfers**: Activities can be reassigned to different users
- **Filtering**: Activities can only be filtered by type, user, and date
- **Deployment**: Application runs locally; no cloud hosting configured

### Technology Stack

**Backend:**
- **NestJS**: Chosen for rapid development, built-in testing support, and TypeScript integration
- **SQLite + TypeORM**: Lightweight database solution ideal for development and testing
- **Jest**: Comprehensive unit and e2e test coverage

**Frontend:**
- **Vanilla JavaScript/HTML/CSS**: Minimal UI focused on functionality over aesthetics
- **Inline Editing**: Edit operations occur directly within the view section for improved UX

**Testing:**
- **Unit Tests**: Mock-based testing for services and controllers
- **E2E Tests**: Full integration tests with isolated test database (`test.sqlite`)

## User Interface

The UI is deliberately simple and functional:

- **Users Section**: Create new users; inline editing and deletion of existing users
- **Activities Section**: Create new activities
- **View Activities Section**: Filter, view, edit (inline), and delete activities

All CRUD operations update immediately without page refresh. The focus is on usability rather than visual design.

## Known Limitations & Future Improvements

### Frontend Enhancements
- Add authentication and authorization
- Implement client-side validation for forms
- Add undo/redo functionality
- Improve delete confirmation UX (move from browser alerts to custom modals)
- Modernize UI with a component framework (React/Vue/Angular)
- Add loading states during async operations
- Implement better error handling and user feedback

### Backend Improvements
- Validate and clarify business requirements
- Enhance error handling with custom exception filters
- Add comprehensive logging
- Implement activity type-specific attributes and validation
- Add audit trails for tracking changes
- Deploy to cloud infrastructure (AWS/Azure/GCP)
- Add API documentation (Swagger/OpenAPI)

### Database
- Consider separate tables for different activity types if requirements expand
- Add db security and authorization
- Add backups and logging

## Use of AI Tools

This project utilized AI assistance strategically to accelerate development, particularly for test generation and UI implementation. While I have professional experience with the entire technology stack (NestJS, TypeORM, Jest, TypeScript), AI is very adept at handling basic CRUD applications. The core architecture, business logic, and design decisions were independently developed. In a complex production environment, I would not normally code with this much use of AI code generation.