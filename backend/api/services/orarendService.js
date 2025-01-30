const orarendRepository  = require("../repositories/orarendRepository");

class OrarendService
{
    async createGroup()
    {
        return await orarendRepository.createGroup();
    }

    async getGroup(ID) {
        return await orarendRepository.getGroup(ID)
    }

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


    async createOra()
    {

    }
    
    async createOrarend()
    {

    }
    async getOra()
    {

    }
    async getOrarend()
    {

    }
}

module.exports = new OrarendService();