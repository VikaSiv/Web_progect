'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import Student from './Student/Student';
import styles from './Students.module.scss';
import AddStudent from './Student/AddStudent/AddStudent';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, addStudentMutate } = useStudents();

  return (
    <div className={styles.Students}>
      <AddStudent onAdd={addStudentMutate} />
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
