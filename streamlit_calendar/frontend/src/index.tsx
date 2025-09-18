import React from 'react';
import { createRoot } from 'react-dom/client';
import Calendar from "./components/Calendar"

const root = createRoot(document.getElementById('root')!);
root.render(<Calendar />);