import sqlite3 from 'sqlite3';

import type StudentInterface from '@/types/StudentInterface';

sqlite3.verbose();

export const getStudentDb = async (): Promise<StudentInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const students = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM student';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve(rows);
      db.close();
    });
  });

  // test data
  // const groups: GroupInterface[] = [
  //   {
  //     name: '2207 д2',
  //   },
  //   {
  //     name: '2207 д2',
  //   },
  // ];

  return students as StudentInterface[];
};

export const deleteStudentDb = async (id: number): Promise<void> => {
  const db = new sqlite3.Database(process.env.DB ?? "./db/vki-web.db");

  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM student WHERE id = ?";

    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        console.log('далено строк: ${this.changes}');
        resolve();
      }
    });

    db.close();
  });
};

export const addStudentDb = async (student: Omit<StudentInterface, 'id'>): Promise<number> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO student (first_name, last_name, middle_name, group_id, isDeleted) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      student.first_name,
      student.last_name,
      student.middle_name,
      student.group_id,
      student.isDeleted || false
    ];

    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        console.log(`Добавлен студент с ID: ${this.lastID}`);
        resolve(this.lastID);
      }
      db.close();
    });
  });
};