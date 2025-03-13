const orarendRepository  = require("../repositories/orarendRepository");

class OrarendService
{

    async getLessons(groups)
    {
        return await orarendRepository.getLessons(groups)

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

    async getDisruptions(groups)
    {
        return await orarendRepository.getDisruptions(groups)
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
    async getOrarend(groups)
    {
        const lessons = await this.getLessons(groups)

        const disruptions = await this.getDisruptions(groups)

        console.log(disruptions+"disruptions")

        const disruptionMap = new Map()
        disruptions.forEach(disruption => {
            const key = `${disruption.day}-${disruption.start_Minute}`
            disruptionMap.set(key, disruption)
        })

        const combinedOrarend = lessons.map(lesson => {
            const key = `${lesson.day}-${lesson.start_Minute}`
            return disruptionMap.get(key) || lesson
        })
        return combinedOrarend
    }
}

module.exports = new OrarendService();