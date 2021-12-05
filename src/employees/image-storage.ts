import{diskStorage} from 'multer'
import{ v4 as uuidv4} from 'uuid'

const fs = require('fs')
const fileType = require('file-type')

import path = require('path')

type validFileExtention = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

const validFileExtentions : validFileExtention[] = ['png' , 'jpg' , 'jpeg']
const validMimeTypes: validMimeType[] = ['image/png' , 'image/jpg' , 'image/jpeg']



export const saveImageToStorage = {
    storage: diskStorage({
        destination: 'C:/Users/GAMAL/Desktop/code/angular-frontEnd/AngularCRUD/src/assets',
        filename: (req,file,cb)=> {
            const fileExtention: string = path.extname(file.originalname)
            const fileName: string = uuidv4() + fileExtention
            cb(null,fileName)
        }
    }),
    fileFilter: (req,file,cb)=>{
        const allowedMimeTypes: validMimeType[] = validMimeTypes
        allowedMimeTypes.includes(file.mimetype) ? cb(null,true) : cb(null, false)
    }
}

