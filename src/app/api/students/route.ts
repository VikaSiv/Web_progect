import { getStudentsDb, addStudentDb } from '@/db/studentDb';
import StudentInterface from '@/types/StudentInterface';

export async function GET(): Promise<Response> {
  const students = await getStudentsDb();

  return new Response(JSON.stringify(students), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export async function POST(request: Request): Promise<Response> {
  try {
    const studentData: Omit<StudentInterface, 'id'> = await request.json();

    if (!studentData.firstName || !studentData.lastName || !studentData.groupId) {
      return new Response(JSON.stringify({ error: 'Необходимо заполнить имя, фамилию и группу' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const studentId = await addStudentDb(studentData);

    return new Response(JSON.stringify({ 
      id: studentId,
      message: 'Студент успешно добавлен' 
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Ошибка при добавлении студента:', error);
    
    return new Response(JSON.stringify({ error: 'Ошибка при добавлении студента' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}