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
        return lessons.find((x)=>x.day == napok[date.getDay()]&& x.start_Hour == date.getHours()&&x.start_Minute == date.getMinutes())
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