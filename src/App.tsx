import Box from '@mui/material/Box';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { lazy, Suspense, useState } from 'react';

type DayPanelProps = {
  children: React.ReactNode;
  index: number;
  selectedIndex: number;
  day: number;
};

function DayPanel(props: DayPanelProps) {
  const { children, index, selectedIndex, day, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={selectedIndex !== index}
      id={`day${day}-tabpanel`}
      aria-labelledby={`day${day}-tab`}
      {...other}
    >
      {selectedIndex === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function getTabProps(day: number): TabProps {
  return {
    label: `Day ${day}`,
    id: `day${day}-tab`,
    'aria-controls': `day${day}-tabpanel`,
  };
}

function getDayPanelProps(
  selectedIndex: number,
  index: number,
  day: number
): Omit<DayPanelProps, 'children'> {
  return {
    selectedIndex,
    index,
    day,
  };
}

export default function App() {
  const [value, setValue] = useState(0);

  const DayComponents = [
    lazy(() => import('./components/day05')),
    lazy(() => import('./components/day04')),
    lazy(() => import('./components/day03')),
    lazy(() => import('./components/day02')),
    lazy(() => import('./components/day01')),
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={(_, value) => setValue(value)} aria-label="Day tabs">
          {DayComponents.map((_day, i) => {
            const dayNumber = DayComponents.length - i;
            return <Tab key={`day${dayNumber}`} {...getTabProps(dayNumber)} />;
          })}
        </Tabs>
      </Box>
      {DayComponents.map((Day, i) => {
        const dayNumber = DayComponents.length - i;
        return (
          <DayPanel key={`day${dayNumber}-panel`} {...getDayPanelProps(value, i, dayNumber)}>
            <Suspense>
              <Day />
            </Suspense>
          </DayPanel>
        );
      })}
    </Box>
  );
}
