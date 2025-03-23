const orarendRepository  = require("../repositories/orarendRepository");

class OrarendService
{

    async getLessons(groups)
    {
        return await orarendRepository.getLessons(groups)
    }


async getTeacherLessons(teacherID, weekStart) {
    console.log("FAAAAAAAAAAAASZ");
    const lessons = await orarendRepository.getTeacherLessons(teacherID);
    const disruptions = await orarendRepository.getTeacherDisruptions(teacherID, weekStart);

    console.log("disruptions: " + disruptions);

    // Build a map for quick lookup from disruptions based on day and start minute.
    const disruptionMap = new Map();
    disruptions.forEach(disruption => {
        console.log("kicsi fasz");
        console.log(disruption);
        const key = `${disruption.day}-${disruption.start_Minute}`;
        disruptionMap.set(key, disruption);
    });

    // Create a set of keys from lessons for later reference.
    const lessonKeys = new Set(lessons.map(lesson => `${lesson.day}-${lesson.start_Minute}`));

    // Combine lessons with disruptions where available.
    const combinedOrarend = lessons.map(lesson => {
        const key = `${lesson.day}-${lesson.start_Minute}`;
        const disruption = disruptionMap.get(key);
        if (disruption) {
            // Return the disruption record with excused true.
            return { ...disruption.dataValues, excused: true };
        } else {
            // Return the lesson with excused false.
            return { ...lesson.dataValues, excused: false };
        }
    });

    disruptions.forEach(disruption => {
        const key = `${disruption.day}-${disruption.start_Minute}`;
        // Only add the disruption if:
        // 1. There was no lesson at that key, and
        // 2. The disruption's teacherID matches the teacherID parameter.
        if (!lessonKeys.has(key) && disruption.teacherID === teacherID) {
            combinedOrarend.push({ ...disruption.dataValues, excused: true });
        }
    });

    console.log(combinedOrarend);
    return combinedOrarend;
}


    getLessonOnDate(lessons,date)
    {
        const napok = ['vasarnap','hetfo', 'kedd', 'szerda', 'csutortok', 'pentek', 'szombat']//W3schoolson vasárnappal kezd, de ez lehet nem jó
        console.log(date.getHours())
        console.log(date.getMinutes())
        console.log(napok[date.getDay()])
        console.log(lessons[0].day == napok[date.getDay()])
        console.log(lessons[0].start_Hour == date.getHours()-1)
        console.log(lessons[0].start_Minute == date.getMinutes())
        return lessons.find((x)=>x.day == napok[date.getDay()]&& x.start_Hour == date.getHours()-1&&x.start_Minute == date.getMinutes())
    }

    async getDisruptions(groups,weekStart)
    {
        return await orarendRepository.getDisruptions(groups,weekStart)
    }



    async createOra()
    {

    }
    
    async createOrarend()
    {

    }
    async getOra()
    {

    }
    async getOrarend(groups, weekStart) {
        const lessons = await this.getLessons(groups);
        const disruptions = await this.getDisruptions(groups, weekStart);
    
        // Create a map of disruptions keyed by day and start_Minute
        const disruptionMap = new Map();
        disruptions.forEach(disruption => {
            const key = `${disruption.day}-${disruption.start_Minute}`;
            disruptionMap.set(key, disruption);
        });
    
        // Combine lessons with disruptions and add an "excused" flag
        const combinedOrarend = lessons.map(lesson => {
            const key = `${lesson.day}-${lesson.start_Minute}`;
            const disruption = disruptionMap.get(key);
            if (disruption) {
                // Return the disruption record with excused true
                return { ...disruption.dataValues, excused: true };
            } else {
                // Return the lesson with excused false
                return { ...lesson.dataValues, excused: false };
            }
        });
        
        return combinedOrarend;
    }

    async getTeachers(){
        return await orarendRepository.getTeachers()
    }
}

module.exports = new OrarendService();