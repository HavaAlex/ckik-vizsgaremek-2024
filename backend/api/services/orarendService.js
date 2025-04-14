const groupRepository = require("../repositories/groupRepository");
const orarendRepository  = require("../repositories/orarendRepository");
const teacherRepository = require("../repositories/teacherRepository");
const roleService = require("./roleService");

class OrarendService
{

    async getLessons(groups)
    {
        return await orarendRepository.getLessons(groups)
    }


async getTeacherLessons(teacherID, weekStart) {

    const lessons = await orarendRepository.getTeacherLessons(teacherID);
    const disruptions = await orarendRepository.getTeacherDisruptions(weekStart);
    const disruptionMap = new Map();
    disruptions.forEach(disruption => {
        const key = `${disruption.day}-${disruption.start_Minute}`;
        disruptionMap.set(key, disruption);
    });
    const lessonKeys = new Set(lessons.map(lesson => `${lesson.day}-${lesson.start_Minute}`));
    const combinedOrarend = lessons.map(lesson => {
        const key = `${lesson.day}-${lesson.start_Minute}`;
        const disruption = disruptionMap.get(key);
        if (disruption) {
            return { ...disruption.dataValues, excused: true };
        } else {
            return { ...lesson.dataValues, excused: false };
        }
    });

    disruptions.forEach(disruption => {
        const key = `${disruption.day}-${disruption.start_Minute}`;
        if (!lessonKeys.has(key) && disruption.teacherID === teacherID) {
            combinedOrarend.push({ ...disruption.dataValues, excused: true });
        }
    });
    return combinedOrarend;
}


    getLessonOnDate(lessons,date)
    {
        const napok = ['vasarnap','hetfo', 'kedd', 'szerda', 'csutortok', 'pentek', 'szombat']
        return lessons.find((x)=>x.day == napok[date.getDay()]&& x.start_Hour == date.getHours()-1&&x.start_Minute == date.getMinutes())
    }

    async getDisruptions(groups,weekStart)
    {
        return await orarendRepository.getDisruptions(groups,weekStart)
    }

    async getOrarend(groups, weekStart) {
        const lessons = await this.getLessons(groups);
        const disruptions = await this.getDisruptions(groups, weekStart);
        const disruptionMap = new Map();
        disruptions.forEach(disruption => {
            const key = `${disruption.day}-${disruption.start_Minute}`;
            disruptionMap.set(key, disruption);
        });
        const combinedOrarend = lessons.map(lesson => {
            const key = `${lesson.day}-${lesson.start_Minute}`;
            const disruption = disruptionMap.get(key);
            if (disruption) {
                return { ...disruption.dataValues, excused: true };
            } else {
                return { ...lesson.dataValues, excused: false };
            }
        });
        
        return combinedOrarend;
    }

    /*async validateLesson(lesson)
    {
        const responseTeacher = await teacherRepository.getTeacher(lesson.teacherName,"teacher")
        if(responseTeacher.length == 0)
        {
            throw new Error("Nincs ilyen tanár: "+lesson.teacherName)
        }
        const responseGroup = await groupRepository.getGroupByID(lesson.groupName)
        if(responseGroup.length == 0)
        {
            throw new Error("Nincs ilyen csoport: "+lesson.groupName)
        }
    }*/

    async getTeachers(){
        return await orarendRepository.getTeachers()
    }

    async getAllLessons(){
        return await orarendRepository.getAllLessons()
    }
}

module.exports = new OrarendService();