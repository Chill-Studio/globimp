import * as axios_ from "axios"
declare global {

 var axios : typeof axios_.default

}
global.axios = axios_ as any
