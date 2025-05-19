import { ClassResponseDto } from '../../generated/model';
import { Course } from '../../types/courseTypes';

export function mapApiClassToCourse(apiClass: ClassResponseDto): Course {
  return {
    classId: apiClass.id_class,
    subjectId: apiClass.id_subject,
    image: apiClass.image,
    status: apiClass.status,
    maxStudents: apiClass.max_students,
    enrolled: apiClass.enrrolled,
    description: apiClass.description,
    Subject: {
      subjectId: apiClass.Subjects.id_subject,
      clave: apiClass.Subjects.clave,
      name: apiClass.Subjects.name,
      credits: apiClass.Subjects.credits,
      Careers: apiClass.Subjects.Careers.map((career) => ({
        careerId: career.id_career,
        name: career.name
        })),
    },
    Schedules: apiClass.Schedules.map((s) => ({
      scheduleId: s.id_schedule,
      dayId: s.id_day,
      startTime: s.start_time,
      endTime: s.end_time,
      Day: {
        dayId: s.Days.id_day,
        name: s.Days.name, 
      },
      Classroom: {
        classroomId: s.Classrooms?.id_classroom ?? null,
        name: s.Classrooms?.name ?? null,
        Building: {
          buildingId: s.Classrooms?.Buildings?.id_building ?? null,
          name: s.Classrooms?.Buildings?.name ?? null,
          sieKey: s.Classrooms?.Buildings?.sie_key ?? null
        }
      }
    })),
  };
}
