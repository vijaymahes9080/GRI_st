import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Calendar } from 'lucide-react';

interface AttendanceDay {
  date: string;
  dayNumber: number;
  status: 'present' | 'absent' | 'holiday' | 'medical';
  course: string;
}

export const AttendanceHeatmap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Generate 84 days (approx 12 weeks of current semester) with stable status
  const daysData: AttendanceDay[] = React.useMemo(() => {
    const list: AttendanceDay[] = [];
    const startDate = new Date(2026, 6, 1); // July 1, 2026
    const courses = ['Data Structures', 'Database Systems', 'Rural Sociology', 'Web Engineering', 'Research Methodology'];
    
    for (let i = 0; i < 84; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let status: 'present' | 'absent' | 'holiday' | 'medical' = 'present';
      if (isWeekend) {
        status = 'holiday';
      } else {
        // Stable pseudo-random based on dayNumber
        const mod = i % 7;
        if (mod === 2 && i % 14 === 0) status = 'absent';
        else if (mod === 5 && i % 21 === 0) status = 'medical';
        else status = 'present';
      }

      list.push({
        date: d.toISOString().split('T')[0],
        dayNumber: i + 1,
        status,
        course: courses[i % courses.length],
      });
    }
    return list;
  }, []);

  const totalPresent = daysData.filter(d => d.status === 'present').length;
  const totalClassDays = daysData.filter(d => d.status !== 'holiday').length;
  const attendancePercentage = Math.round((totalPresent / totalClassDays) * 100);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 340;
    const height = 130;
    svg.attr('width', width).attr('height', height);

    const rows = 7;  // 7 days a week
    const cellSize = 22;
    const cellGap = 4;
    const offsetX = 10;
    const offsetY = 15;

    const colorMap = {
      present: '#059669', // emerald-600
      absent: '#e11d48',  // rose-600
      holiday: '#cbd5e1', // slate-300
      medical: '#d97706', // amber-600
    };

    const g = svg.append('g').attr('transform', `translate(${offsetX}, ${offsetY})`);

    daysData.forEach((d, idx) => {
      const col = Math.floor(idx / rows);
      const row = idx % rows;

      const x = col * (cellSize + cellGap);
      const y = row * (cellSize + cellGap);

      g.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('rx', 5)
        .attr('fill', colorMap[d.status])
        .attr('class', 'transition-all duration-200 cursor-pointer hover:opacity-80')
        .on('mouseenter', (event) => {
          setTooltip({
            text: `${d.date} (${d.course}): ${d.status.toUpperCase()}`,
            x: event.offsetX,
            y: event.offsetY - 30,
          });
        })
        .on('mouseleave', () => setTooltip(null));
    });

  }, [daysData]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Semester Attendance Heatmap (D3.js)
          </h3>
          <p className="text-xs text-gray-500">Current Semester Daily Attendance Matrix</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-extrabold text-emerald-600">{attendancePercentage}%</span>
          <p className="text-[10px] text-gray-400">Overall Frequency</p>
        </div>
      </div>

      <div className="relative flex justify-center bg-gray-50 dark:bg-slate-950 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-x-auto">
        <svg ref={svgRef} className="overflow-visible" />
        {tooltip && (
          <div
            className="absolute z-20 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded-lg shadow-xl pointer-events-none whitespace-nowrap"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block"></span>
          <span>Present ({totalPresent})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-600 inline-block"></span>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-600 inline-block"></span>
          <span>Medical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-300 dark:bg-slate-700 inline-block"></span>
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
};
