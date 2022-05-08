import { useEffect as useEffect_, useState as useState_ } from "react"
import * as axios_ from "axios"

declare global {
    var useEffect : typeof useEffect_
    var useState : typeof useState_
    var axios : typeof axios_.default
}

global.useEffect = useEffect_ as any
global.useState = useState_ as any
global.axios = axios_ as any

