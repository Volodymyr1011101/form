import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { CalendarProps } from 'antd';
import { Button, Calendar, theme } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './Calendar.module.scss';
interface IPlHolidays {
    country: string;
    date: string;
    day: string;
    iso: string;
    name: string;
    type: string;
    year: number;
}
const availableHours = Array.from({ length: 24 }, (_, hour) => `${hour}:00`);

const CalendarComponent = ({ setDateHours }: { setDateHours: Dispatch<SetStateAction<any>> }) => {
    const { token } = theme.useToken();
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [plDays, setPlDays] = useState<IPlHolidays[] | null>(null);
    const [hours, setHours] = useState<string[]>([]);
    useEffect(() => {
        setDateHours({
            day: currentDate.format('YYYY-MM-DD'),
            hours: hours
        });
    }, [currentDate, hours]);
    const disabledDate = (current: Dayjs) => {
        if (current && current.isBefore(dayjs(), 'day')) {
            return true;
        }
        if (current && plDays !== null) {
            const formattedDate = current.format('YYYY-MM-DD');
            return plDays?.some(day => day.date === formattedDate && day.type === 'NATIONAL_HOLIDAY');
        }
        return current.day() === 0;
    };
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.checked) {
            setHours(prev => [...prev, value]);
        } else {
            setHours(prev => prev.filter(hour => hour !== value));
        }
    };
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const result = await fetch('https://api.api-ninjas.com/v1/holidays?country=PL&year=2024', {
                    method: 'GET',
                    headers: {
                        'X-Api-Key': '8DX8eEe67njS1lbThFsdSw==rQQNpQ8PYbPZBjrx'
                    }
                });

                if (!result.ok) {
                    throw new Error(`HTTP error! status: ${result.status}`);
                }

                const data = await result.json();
                setPlDays(data);
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        };
        fetchHolidays();
    }, []);

    const onPanelChange: CalendarProps<Dayjs>['onPanelChange'] = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
        setCurrentDate(value);
    };

    const onDateSelect: CalendarProps<Dayjs>['onSelect'] = value => {
        setSelectedDate(value);
        setCurrentDate(value);
    };

    const headerRender: CalendarProps<Dayjs>['headerRender'] = ({ value, onChange }) => {
        const currentMonth = value.format('MMMM YYYY');

        const prevMonth = () => {
            const newDate = value.subtract(1, 'month');
            setCurrentDate(newDate);
            onChange(newDate);
        };

        const nextMonth = () => {
            const newDate = value.add(1, 'month');
            setCurrentDate(newDate);
            onChange(newDate);
        };

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}>
                <Button icon={<LeftOutlined />} onClick={prevMonth} />
                <div>{currentMonth}</div>
                <Button icon={<RightOutlined />} onClick={nextMonth} />
            </div>
        );
    };

    return (
        <div className={styles.datePicker}>
            <div className={styles.calendar}>
                <Calendar
                    fullscreen={false}
                    value={currentDate}
                    onPanelChange={onPanelChange}
                    onSelect={onDateSelect}
                    headerRender={headerRender}
                    disabledDate={disabledDate}
                />
            </div>
            <div>
                <h3>Time</h3>
                {selectedDate && (
                    <ul className={styles.timeList}>
                        {availableHours.map(
                            (item, index) =>
                                index > 14 &&
                                index < 20 && (
                                    <li className={styles.item} key={item + index}>
                                        <input
                                            value={item}
                                            type="checkbox"
                                            id={`item` + index}
                                            className={styles.timeCheckbox}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label htmlFor={'item' + index} className={styles.timeLabel}>
                                            {item}
                                        </label>
                                    </li>
                                )
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CalendarComponent;
