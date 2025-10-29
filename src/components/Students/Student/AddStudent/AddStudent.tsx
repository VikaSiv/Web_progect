'use client';

import { useForm } from 'react-hook-form';
import type StudentInterface from '@/types/StudentInterface';
import styles from './AddStudent.module.scss';

interface AddStudentProps {
  onAdd: (student: StudentInterface) => void; // 👈 вместо Omit
}

const AddStudent = ({ onAdd }: AddStudentProps): React.ReactElement => {
  const { register, handleSubmit, reset } = useForm<StudentInterface>();

  const onSubmit = (data: StudentInterface) => {
    const preparedData = { ...data, group_id: Number(data.groupId) };
    onAdd(preparedData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.AddStudent}>
      <h3>Добавить студента</h3>

      <input
        {...register('lastName', { required: true })}
        placeholder="Фамилия"
      />

      <input
        {...register('firstName', { required: true })}
        placeholder="Имя"
      />

      <input
        {...register('middleName')}
        placeholder="Отчество"
      />

      <input
        type="number"
        {...register('groupId', { required: true, valueAsNumber: true })}
        placeholder="ID группы"
      />

      <button type="submit">Добавить</button>
    </form>
  );
};

export default AddStudent;
