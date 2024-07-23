import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CalendarComponent from '../Calendar/Calendar';
import styles from './Form.module.scss';
interface Props {
    title: string;
}
interface FormValues {
    firstName: string;
    lastName: string;
    age: string;
    email: string;
    image: FileList;
}
interface IHours {
    day: string;
    hours: string[];
}
export const Form = ({ title }: Props) => {
    const [age, setAge] = useState('8');
    const [dragActive, setDragActive] = useState(false);
    const [image, setImage] = useState<FileList | null>(null);
    const [dateHours, setDateHours] = useState<IHours>({
        day: '',
        hours: []
    });
    const handleSend = async (data: FormData) => {
        try {
            await fetch('http://letsworkout.pl/submit', {
                method: 'POST',
                body: data
            });
        } catch (error) {
            console.log(error);
        }
    };
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValues>();
    const getThumbPosition = (value: string) => {
        const min = 8;
        const max = 100;
        const range = max - min;
        const percentage = ((+value - min) / range) * 100;
        return `calc(${percentage}%`;
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setValue('image', e.dataTransfer.files);
            setImage(e.dataTransfer.files);
        }
    };

    return (
        <div className={`${styles.formWrapper}`}>
            <h1>{title}</h1>
            <form className={styles.form}>
                <div className={`${styles.inputWrapper} ${errors.firstName && styles.error}`}>
                    <label htmlFor="firstName">First Name</label>
                    <input {...register('firstName', { required: true })} id="firstName" />
                    {errors.firstName && <p>First name is required.</p>}
                </div>
                <div className={`${styles.inputWrapper} ${errors.lastName && styles.error}`}>
                    <label htmlFor="lastName">Last Name</label>
                    <input {...register('lastName', { required: true })} id="lastName" />
                    {errors.lastName && <p>Last name is required.</p>}
                </div>
                <div className={`${styles.inputWrapper} ${errors.email && styles.error}`}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        {...register('email', {
                            required: true,
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: `Please use correct formatting.
Example: address@email.com`
                            }
                        })}
                        id="email"
                    />
                    {errors.email && <p className={styles.errorMessage}>Please use correct formatting. Example: address@email.com</p>}
                </div>
                <div className={styles.ageInput}>
                    <label htmlFor="age">Age</label>
                    <span className={styles.minAgeValue}>8</span>
                    <input
                        className={styles.rangeInput}
                        type="range"
                        min="8"
                        max="100"
                        defaultValue={0}
                        {...register('age', { required: true, min: 8 })}
                        onChange={e => {
                            setAge(e.target.value);
                        }}
                        id="age"
                    />
                    <span className={styles.maxAgeValue}>100</span>
                    <span className={styles.currentValue} style={{ left: getThumbPosition(age) }}>
                        {age}
                    </span>
                </div>
                <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={styles.inputImageWrapper}>
                    <h3>Photo</h3>
                    <label htmlFor="image" className={styles.imageInputWrapper}>
                        {image && image[0] ? (
                            <>
                                <span>{image[0].name}</span>
                                <span
                                    onClick={e => {
                                        e.preventDefault();
                                        setImage(null);
                                    }}
                                    className={styles.deleteBut}
                                ></span>
                            </>
                        ) : (
                            <p>
                                <span className={styles.uploadText}>Upload a file</span> <span className={styles.additionalText}> or drag and drop here</span>
                            </p>
                        )}
                    </label>
                    <input
                        className={styles.fileInput}
                        type="file"
                        {...register('image')}
                        id="image"
                        onChange={e => {
                            setImage(e.target.files);
                        }}
                    />
                </div>
                <CalendarComponent setDateHours={setDateHours} />
                <button
                    className={styles.sendButton}
                    onClick={handleSubmit(data => {
                        const test = {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            age: data.age,
                            image: image && image[0],
                            day: dateHours.day,
                            hours: dateHours.hours
                        };

                        const formData = new FormData();
                        formData.append('firstName', data.firstName);
                        formData.append('lastName', data.lastName);
                        formData.append('age', data.age);
                        formData.append('email', data.email);
                        image && formData.append('image', image[0]);
                        formData.append('day', dateHours.day);
                        formData.append('hours', JSON.stringify(dateHours.hours));
                        handleSend(formData);
                    })}
                >
                    Send Application
                </button>
            </form>
        </div>
    );
};
