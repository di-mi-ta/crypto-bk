import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}

export const requestUploadFile = (data) => {
    return {
        type: ActionTypes.UPLOAD_FILE_REQUEST,
        data
    }
}
  
export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds));
    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then((response) => {
        if (response.ok) {
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', response.token);
            localStorage.setItem('creds', JSON.stringify(creds));
            // Dispatch the success action
            dispatch(receiveLogin(response));
        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => {
        dispatch(loginError(error.message)
    )})
};

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    dispatch(receiveLogout())
}

export const uploadFile = (file, user) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    let data = new FormData();
    data.append('fileUpload', file);
    data.append('owner', user);
    return fetch(baseUrl + 'uploadFile', {
        method: 'POST',
        body: data,
        headers: {
            'Authorization': bearer,
        },
    })
    .then(response => {
        if (response.ok) {
            return response;
        }
        else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errmess = new Error(error.message);
        throw errmess;
    })
    .then(response => {alert(JSON.stringify(response.json()))})
    .catch(error => { console.log('Upload File', error.message);
        alert('Error in upload file to server: '+ error.message);
    })
}

// export const postComment = (dishId, rating, comment) => (dispatch) => {

//     const newComment = {
//         dish: dishId,
//         rating: rating,
//         comment: comment
//     }
//     console.log('Comment ', newComment);

//     const bearer = 'Bearer ' + localStorage.getItem('token');

//     return fetch(baseUrl + 'comments', {
//         method: 'POST',
//         body: JSON.stringify(newComment),
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': bearer
//         },
//         credentials: 'same-origin'
//     })
//     .then(response => {
//         if (response.ok) {
//             return response;
//         }
//         else {
//             var error = new Error('Error ' + response.status + ': ' + response.statusText);
//             error.response = response;
//             throw error;
//         }
//     },
//     error => {
//         var errmess = new Error(error.message);
//         throw errmess;
//     })
//     .then(response => response.json())
//     // .then(response => dispatch(addComment(response)))
//     .catch(error => { console.log('Post comments ', error.message);
//         alert('Your comment could not be posted\nError: '+ error.message); })
// }



// export const postFeedback = (feedback) => (dispatch) => {
        
//     return fetch(baseUrl + 'feedback', {
//         method: "POST",
//         body: JSON.stringify(feedback),
//         headers: {
//           "Content-Type": "application/json"
//         },
//         credentials: "same-origin"
//     })
//     .then(response => {
//         if (response.ok) {
//           return response;
//         } else {
//           var error = new Error('Error ' + response.status + ': ' + response.statusText);
//           error.response = response;
//           throw error;
//         }
//       },
//       error => {
//             throw error;
//       })
//     .then(response => response.json())
//     .then(response => { console.log('Feedback', response); alert('Thank you for your feedback!\n'+JSON.stringify(response)); })
//     .catch(error =>  { console.log('Feedback', error.message); alert('Your feedback could not be posted\nError: '+error.message); });
// };