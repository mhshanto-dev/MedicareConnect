const fs = require('fs');
const path = require('path');

const base = 'c:/assignment-10/frontend/src/app';

const routes = [
  '/doctor/[id]',
  '/dashboard/patient',
  '/dashboard/patient/profile',
  '/dashboard/patient/prescriptions',
  '/dashboard/patient/favorites',
  '/dashboard/patient/notifications',
  '/dashboard/doctor',
  '/dashboard/doctor/profile',
  '/dashboard/doctor/appointments',
  '/dashboard/doctor/reviews',
  '/dashboard/doctor/analytics',
  '/dashboard/admin',
  '/dashboard/admin/appointments',
  '/dashboard/admin/reports'
];

routes.forEach(route => {
  const dir = path.join(base, route);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const file = path.join(dir, 'page.jsx');
  if (!fs.existsSync(file)) {
    const compName = 'Page' + Math.random().toString(36).substring(7);
    fs.writeFileSync(file, `export default function ${compName}() { return <div className="p-6"><h1 className="text-2xl font-bold">${route}</h1><p>This page is under construction.</p></div>; }`);
  }
});

console.log('Created missing route files');
