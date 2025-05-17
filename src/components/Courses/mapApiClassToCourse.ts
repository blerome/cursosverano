import { GetClasses200DataItem } from '../../generated/model';
import { Course } from '../../types/courseTypes';

export function mapApiClassToCourse(apiClass: GetClasses200DataItem): Course {
  return {
    id: apiClass.id_class,
    image: apiClass.image,
    idSubject: apiClass.id_subject,
    name: apiClass.Subjects.name,
    clave: apiClass.Subjects.clave,
    credits: apiClass.Subjects.credits,
    schedule: apiClass.Schedules.map((s) => ({
      day: s.Days.name,
      startTime: s.start_time,
      endTime: s.end_time,
    })),
    status: apiClass.status,
    maxStudents: apiClass.max_students,
    enrolled: apiClass._count.Students_Classes,
    careers: apiClass.Subjects.Careers_Subjects.map((cs) => cs.Careers.name),
    description: apiClass.description,
  };
}
