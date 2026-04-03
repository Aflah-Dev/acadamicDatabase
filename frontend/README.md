# Student Academic Record Management System - Frontend

React-based frontend application for the Student Academic Record Management System.

## Features

- Student registration with ID, gender, class, grade, and semester selection
- Class management with homeroom teacher assignment
- Subject management with CRUD operations
- Mark entry with validation (0-100)
- Academic reports with filtering, sorting, and pagination
- Clean and minimal UI using Tailwind CSS
- Responsive design

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Install dependencies:

```bash
npm install
```

2. (Optional) Create a `.env` file if you need to customize the API URL:

```
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set:

- Development uses `http://localhost:5000/api`
- Production uses same-origin `/api`

## Running the Application

### Development mode:

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for production:

```bash
npm run build
```

### Preview production build:

```bash
npm run preview
```

## Production Integration

For a single-domain deployment (recommended):

1. Build frontend (`npm run build` in `frontend/`)
2. Run backend with `NODE_ENV=production` and `SERVE_FRONTEND=true`
3. Frontend calls `/api` on the same origin automatically

## Pages

### Home Page (/)

- Overview of the system
- Quick navigation to all features
- Key features list

### Student Registration (/students)

- Register new students
- Fields: Student ID, Name, Gender, Class, Grade (9-12), Academic Year, Semester (I/II)
- Client-side validation
- Success/error messages

### Class Management (/classes)

- Add and edit classes
- Assign one homeroom teacher per class
- Fields: Class Name, Grade, Academic Year, Semester, Homeroom Teacher

### Subject Management (/subjects)

- View all subjects
- Add new subjects
- Edit existing subjects
- Delete subjects (if no marks recorded)
- Fields: Name, Code, Department, Total Mark

### Mark Entry (/marks)

- Record marks for students
- Select student and subject from dropdowns
- Enter mark (0-100) with validation
- Specify semester and academic year
- Prevents duplicate entries

### Academic Reports (/reports)

- View comprehensive academic reports
- Filter by: Grade, Academic Year, Semester, Student ID
- Includes per-subject marks (Maths, English, Biology, Chemistry, Physics)
- Sort by: Rank, Total Marks, Average Score
- Pagination (20 records per page)
- Visual PASS/FAIL status (green/red)
- Total shown out of 500 with automatic ranking calculation

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx           # Navigation component
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page
│   │   ├── StudentRegistrationPage.jsx
│   │   ├── SubjectManagementPage.jsx
│   │   ├── MarkEntryPage.jsx
│   │   └── AcademicReportPage.jsx
│   ├── services/
│   │   └── api.js                # API service layer
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## API Integration

The frontend communicates with the backend API through the `api.js` service layer:

- `studentAPI` - Student operations
- `subjectAPI` - Subject operations
- `departmentAPI` - Department operations
- `markAPI` - Mark operations
- `reportAPI` - Report operations

All API calls include error handling and return appropriate error messages.

## Styling

The application uses Tailwind CSS for styling with a clean, minimal design:

- Utility-first CSS approach
- Responsive design
- Consistent color scheme (blue primary, green for PASS, red for FAIL)
- Form validation feedback
- Loading states
- Hover effects

## Validation

Client-side validation includes:

- Required field validation
- Mark range validation (0-100)
- Grade enum validation (9, 10, 11, 12)
- Semester enum validation (I, II)
- Email format validation (for teachers)
- Positive integer validation

## Error Handling

- API errors are caught and displayed to users
- Network errors show appropriate messages
- 409 Conflict errors (e.g., cannot delete with dependencies)
- 404 Not Found errors
- Validation errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
