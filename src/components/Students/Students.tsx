'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import Student from './Student/Student';
import styles from './Students.module.scss';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate } = useStudents();

  return (
    <div className={styles.Students}>
      {students.map((student: StudentInterface) => (
        <Student 
          key={student.id} 
          student={student} 
          onDelete={deleteStudentMutate} 
        />
      ))}
    </div>
  );
};

export default Students;
