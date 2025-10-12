'use client';

import { useForm } from 'react-hook-form';
import type StudentInterface from '@/types/StudentInterface';
import styles from './AddStudent.module.scss';

interface AddStudentProps {
  onAdd: (student: Omit<StudentInterface, 'id'>) => void;
}

const AddStudent = ({ onAdd }: AddStudentProps): React.ReactElement => {
  const { register, handleSubmit, reset } = useForm<Omit<StudentInterface, 'id'>>();

  const onSubmit = (data: Omit<StudentInterface, 'id'>) => {
    const preparedData = { ...data, group_id: Number(data.group_id) };
    onAdd(preparedData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.AddStudent}>
      <h3>Добавить студента</h3>

      <input
        {...register('last_name', { required: true })}
        placeholder="Фамилия"
      />

      <input
        {...register('first_name', { required: true })}
        placeholder="Имя"
      />

      <input
        {...register('middle_name')}
        placeholder="Отчество"
      />

      <input
        type="number"
        {...register('group_id', { required: true, valueAsNumber: true })}
        placeholder="ID группы"
      />

      <button type="submit">Добавить</button>
    </form>
  );
};

export default AddStudent;
