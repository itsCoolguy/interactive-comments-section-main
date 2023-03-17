// const production = true;

// const commentSection = document.querySelector('main');
// const commentCardTemplate = document.querySelector('.comment-card').cloneNode(true);

// const addCommentFrame = document.querySelector('#add-comment');
// const sendCommentButton = document.querySelector('.send-comment-button');
// const commentText = document.querySelector('#add-comment-text');

// let commentToBeDeleted = null;

// let currentId = 1;
// let data_;

// if (production) {
//     fetch('./data.json').then((res) => {
//         return res.json();
//     }).then((val) => {
//         loadComments(val);
//         data_ = val;
//         if (typeof sendComment == 'undefined') {
//             document.querySelector('#comment-handler-script').addEventListener('load', () => {
//                 setData(val);
//             });
//         } else {
//             setData(val);
//         }
//     });
//     document.querySelector('.comment-card').remove();
// }

// const observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       if (mutation.type === "attributes") {
//         const score = mutation.target.getAttribute('score');
//         mutation.target.querySelector('.comment-vote-frame-desktop').querySelector('.comment-votes-text').textContent = score;
//         mutation.target.querySelector('.comment-footer').querySelector('.comment-votes-text').textContent = score;
        
//         // mutation.target.querySelectorAll('.comment-votes-text').forEach(element => {
//         //     element.textContent = mutation.target.getAttribute('score');
//         // });
//         return mutation.target;
//       }
//     });
// });
// //observer.observe(commentSection, {attributes: true});

// function showAdmin(card) {
//     if (window.innerWidth < 800) {
//         // card.querySelectorAll('.reply-button').forEach(element => {element.style.display = 'none'});
//         card.querySelectorAll('.delete-button').forEach(element => {element.style.display = 'flex'});
//         card.querySelectorAll('.edit-button').forEach(element => {element.style.display = 'flex'});
//         card.querySelectorAll('.delete-button-desktop').forEach(element => {element.style.display = 'none'});
//         card.querySelectorAll('.edit-button-desktop').forEach(element => {element.style.display = 'none'});
//     } else {
//         card.querySelectorAll('.delete-button').forEach(element => {element.style.display = 'none'});
//         card.querySelectorAll('.edit-button').forEach(element => {element.style.display = 'none'});
//         // card.querySelectorAll('.reply-button-desktop').forEach(element => {element.style.display = 'none'});
//         card.querySelectorAll('.delete-button-desktop').forEach(element => {element.style.display = 'flex'});
//         card.querySelectorAll('.edit-button-desktop').forEach(element => {element.style.display = 'flex'});
//     }
// }

// window.addEventListener('resize', () => {
//     document.querySelectorAll('.comment-card').forEach(element => {
//         if (element.querySelector('.comment-poster').textContent === data_.currentUser.username) {
//             showAdmin(element);
//         }
//     })
// })

// let times = 0;

// const createCard = (data, currentUser, parent) => {
//     const commentData = data;
//     times ++;
//     currentId ++;
//     const clonedComment = commentCardTemplate.cloneNode(true);
//     clonedComment.querySelector('.main-comment-text').innerHTML = '<strong></strong>' + commentData.content;
//     clonedComment.id = commentData.id;
//     clonedComment.setAttribute('score', commentData.score);
//     clonedComment.querySelector('.comment-time').textContent = commentData.createdAt;
//     clonedComment.querySelector('.comment-poster').textContent = commentData.user.username;
//     clonedComment.querySelectorAll('.comment-votes-text').forEach(element => {
//         element.textContent = commentData.score.toString();
//     })
//     clonedComment.querySelector('.comment-profile-picture').src = commentData.user.image.webp;
//     clonedComment.querySelectorAll('.delete-button').forEach(element => {
//         element.addEventListener('click', () => {
//             deleteCommentConfirmation(clonedComment);
//         })
//     })
//     clonedComment.querySelectorAll('.edit-button').forEach(element => {
//         element.addEventListener('click', () => {
//             editComment(clonedComment);
//         })
//     })
//     clonedComment.querySelectorAll('.reply-button').forEach(element => {
//         element.addEventListener('click', () => {
//             openReplyFrame(clonedComment);
//         })
//     })
//     clonedComment.querySelectorAll('.update-comment-button').forEach(element => {
//         element.addEventListener('click', () => {
//             updateComment(clonedComment);
//         })
//     })
//     clonedComment.querySelectorAll('.cancel-comment-update-button').forEach(element => {
//         element.addEventListener('click', () => {
//             cancelCommentEdit(clonedComment);
//         })
//     })
//     clonedComment.querySelectorAll('.cancel-reply-button').forEach(element => {
//         element.addEventListener('click', () => {
//             cancelReplyFrame(clonedComment);
//         })
//     })
//     clonedComment.querySelectorAll('.send-reply-button').forEach(element => {
//         element.addEventListener('click', () => {
//             sendReply(clonedComment);
//         })
//     })
//     observer.observe(clonedComment, {attributes: true});

//     if (commentData.user.username == currentUser.username) {
//         showAdmin(clonedComment);
//     }
//     if (parent === commentSection) {
//         parent.insertBefore(clonedComment, addCommentFrame);
//     } else {
//         parent.appendChild(clonedComment);
//     }

//     let sessionComments = JSON.parse(sessionStorage.getItem('comments'));
//     if (sessionComments == null) {
//         sessionStorage.setItem('comments', JSON.stringify([]));
//         sessionComments = JSON.parse(sessionStorage.getItem('comments'));
//     }
//     if (!(commentData.id in sessionComments)) {
//         console.log('new comment');
//     }
//     sessionComments.push(JSON.stringify(commentData));
//     sessionStorage.setItem('comments', JSON.stringify(sessionComments));
//     console.log(sessionComments);
//     return clonedComment;
// }

// function loadComments(data) {
//     document.querySelector('#add-comment-profile-picture').src = data.currentUser.image.webp;
//     const comments = data.comments;
//     for (i = 0; i < comments.length; i++) {
//         const newComment = createCard(comments[i], data.currentUser, commentSection);
//         for (a = 0; a < comments[i].replies.length; a++) {
//             createCard(comments[i].replies[a], data.currentUser, newComment.querySelector('.comment-replies'));
//         }
//     }
// }

// // function deleteCommentConfirmation(card) {
// //     if (card.querySelector('.comment-poster').textContent === data_.currentUser.username) {
// //         document.querySelector('#black-overlay').style.display = 'block';
// //         document.querySelector('#confirm-deletion').style.display = 'block';
// //         commentToBeDeleted = card;
// //     }
// // }

// // function deleteComment() {
// //     const oldId = commentToBeDeleted.id;
// //     commentToBeDeleted.remove();
// //     document.querySelectorAll('.comment-card').forEach(card => {
// //         if (Number(card.id) > oldId) {
// //             card.id = Number(card.id) - 1;
// //         }
// //     })
// //     document.querySelector('#black-overlay').style.display = 'none';
// //     document.querySelector('#confirm-deletion').style.display = 'none';
// //     commentToBeDeleted = null;
// // }

// // function cancelCommentDeletion() {
// //     document.querySelector('#black-overlay').style.display = 'none';
// //     document.querySelector('#confirm-deletion').style.display = 'none';
// //     commentToBeDeleted = null;
// // }

// // function sendComment() {
// //     dataToSend = {
// //         "content": commentText.value,
// //         "createdAt": 'Just now',
// //         "id": currentId,
// //         "user": {
// //             "username": data_.currentUser.username,
// //             "image": {
// //                 "webp": data_.currentUser.image.webp,
// //                 "png": data_.currentUser.image.png,
// //             },
// //         },
// //         "score": 0,
// //     }
// //     createCard(dataToSend, data_.currentUser, commentSection);
// // }