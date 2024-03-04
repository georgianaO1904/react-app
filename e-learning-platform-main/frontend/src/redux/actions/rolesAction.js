import axios from 'axios'

export const listAllRoles = async(token) => {
    const res = await axios.get('/roles', {
        headers: {Authorization: token}
    })
 
    return res
    
}