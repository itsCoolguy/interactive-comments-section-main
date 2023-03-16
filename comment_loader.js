const production = true;

const commentSection = document.querySelector('main');
const commentCardTemplate = document.querySelector('.comment-card').cloneNode(true);

const addCommentFrame = document.querySelector('#add-comment');
const sendCommentButton = document.querySelector('.send-comment-button');
const commentText = document.querySelector('#add-comment-text');

let commentToBeDeleted = null;

let currentId = 1;
let data_;

if (production) {
    fetch('./data.json').then((res) => {
        return res.json();
    }).then((val) => {
        loadComments(val);
        data_ = val;
        if (typeof sendComment == 'undefined') {
            document.querySelector('#comment-handler-script').addEventListener('load', () => {
                setData(val);
            });
        } else {
            setData(val);
        }
    });
    document.querySelector('.comment-card').remove();
}

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === "attributes") {
        const score = mutation.target.getAttribute('score');
        mutation.target.querySelector('.comment-vote-frame-desktop').querySelector('.comment-votes-text').textContent = score;
        mutation.target.querySelector('.comment-footer').querySelector('.comment-votes-text').textContent = score;
        
        // mutation.target.querySelectorAll('.comment-votes-text').forEach(element => {
        //     element.textContent = mutation.target.getAttribute('score');
        // });
        return mutation.target;
      }
    });
});
//observer.observe(commentSection, {attributes: true});

function showAdmin(card) {
    if (window.innerWidth < 650) {
        // card.querySelectorAll('.reply-button').forEach(element => {element.style.display = 'none'});
        card.querySelectorAll('.delete-button').forEach(element => {element.style.display = 'flex'});
        card.querySelectorAll('.edit-button').forEach(element => {element.style.display = 'flex'});
        card.querySelectorAll('.delete-button-desktop').forEach(element => {element.style.display = 'none'});
        card.querySelectorAll('.edit-button-desktop').forEach(element => {element.style.display = 'none'});
    } else {
        card.querySelectorAll('.delete-button').forEach(element => {element.style.display = 'none'});
        card.querySelectorAll('.edit-button').forEach(element => {element.style.display = 'none'});
        // card.querySelectorAll('.reply-button-desktop').forEach(element => {element.style.display = 'none'});
        card.querySelectorAll('.delete-button-desktop').forEach(element => {element.style.display = 'flex'});
        card.querySelectorAll('.edit-button-desktop').forEach(element => {element.style.display = 'flex'});
    }
}

window.addEventListener('resize', () => {
    document.querySelectorAll('.comment-card').forEach(element => {
        if (element.querySelector('.comment-poster').textContent === data_.currentUser.username) {
            showAdmin(element);
        }
    })
})

let times = 1;

const createCard = (data, currentUser, parent) => {
    let commentData = null;
    if (typeof(data) === 'object') {
        commentData = data;
    } else if (typeof(data) === 'string') {
        commentData = JSON.parse(data);
    }
    commentData = data;
    currentId ++;
    const clonedComment = commentCardTemplate.cloneNode(true);
    clonedComment.querySelector('.main-comment-text').innerHTML = '<strong></strong>' + commentData.content;
    clonedComment.id = commentData.id;
    clonedComment.setAttribute('score', commentData.score);
    clonedComment.querySelector('.comment-time').textContent = commentData.createdAt;
    clonedComment.querySelector('.comment-poster').textContent = commentData.user.username;
    clonedComment.querySelectorAll('.comment-votes-text').forEach(element => {
        element.textContent = commentData.score.toString();
    })
    clonedComment.querySelector('.comment-profile-picture').src = commentData.user.image.webp;
    clonedComment.querySelectorAll('.delete-button').forEach(element => {
        element.addEventListener('click', () => {
            deleteCommentConfirmation(clonedComment);
        })
    })
    clonedComment.querySelectorAll('.edit-button').forEach(element => {
        element.addEventListener('click', () => {
            editComment(clonedComment);
        })
    })
    clonedComment.querySelectorAll('.reply-button').forEach(element => {
        element.addEventListener('click', () => {
            openReplyFrame(clonedComment);
        })
    })
    clonedComment.querySelectorAll('.update-comment-button').forEach(element => {
        element.addEventListener('click', () => {
            updateComment(clonedComment);
        })
    })
    clonedComment.querySelectorAll('.cancel-comment-update-button').forEach(element => {
        element.addEventListener('click', () => {
            cancelCommentEdit(clonedComment);
        })
    })
    clonedComment.querySelectorAll('.cancel-reply-button').forEach(element => {
        element.addEventListener('click', () => {
            cancelReplyFrame(clonedComment);
        })
    })
    clonedComment.querySelectorAll('.send-reply-button').forEach(element => {
        element.addEventListener('click', () => {
            sendReply(clonedComment);
        })
    })
    observer.observe(clonedComment, {attributes: true});

    // Giving user permission to delete and edit comment if they are the owner
    if (commentData.user.username == currentUser.username) {
        showAdmin(clonedComment);
    }

    /* If it is a comment, put it before the 'add comment' frame, if it is a reply, simply just add it at the bottom of the 
    parent comment */
    if (parent === commentSection) {
        parent.insertBefore(clonedComment, addCommentFrame);
    } else {
        parent.appendChild(clonedComment);
    }

    // Get the comments from sessionStorage
    let sessionComments = JSON.parse(sessionStorage.getItem('comments'));
    if (sessionComments == null) {
        // If there are no comments, set sessionStorage comments to an empty array
        sessionStorage.setItem('comments', JSON.stringify([]));
        sessionComments = JSON.parse(sessionStorage.getItem('comments'));
    }
    // Loops through all sessionStorage comments and checks if there is already an index created for the comment
    let canContinue = true;
    const loopCheck = function(element) { 
        element.forEach(item => {
            if (Number(item.id) == Number(commentData.id)) {
                canContinue = false;
            } else {
                //console.log(item);
                loopCheck(item.replies);
            }
        })
    }
    loopCheck(sessionComments);
    if (canContinue === true) {
        // if ('replyingTo' in commentData) {
        //     console.log('comment data has a replyingTo in it, meaning it is a reply: ' + times);
        //     times ++;
        //     return clonedComment;
        // }
        const checkForReplyPush = function(element) {
            element.forEach(item => {
                if (Number(item.id) === Number(parent.closest('.comment-card').id)) {
                    item.replies.push(commentData);
                    return true;
                }
                checkForReplyPush(item.replies);
            })
        }
        if (parent === commentSection) {
            sessionComments.push(commentData);
        } else {
            checkForReplyPush(sessionComments);
            // sessionComments.forEach(item => {
            //     console.log(item.id + ':' + Number(parent.closest('.comment-card').id))
            //     if (Number(item.id) === Number(parent.closest('.comment-card').id)) {
            //         item.replies.push(commentData);
            //     }
            // })
        }
        sessionStorage.setItem('comments', JSON.stringify(sessionComments));
    }
    times ++;
    return clonedComment;
}

function loadComments(data) {
    document.querySelector('#add-comment-profile-picture').src = data.currentUser.image.webp;
    let comments = null;
    if (sessionStorage.getItem('comments') !== 'null' && sessionStorage.getItem('comments') !== null) {
        comments = JSON.parse(sessionStorage.getItem('comments'));
    } else {
        comments = data.comments;
    }
    const reacurr = function(parent, newComment) {
        if (parent.length > 0){
            for (let a = 0; a < parent.length; a++) {
                let newReply = createCard(parent[a], data.currentUser, newComment.querySelector('.comment-replies'));

                const oldParent = reacurr(parent[a].replies, newReply);
            }
            return parent;
        }
        //reacurr(parent)
    }
    for (i = 0; i < comments.length; i++) {
        //console.log('creating top level comment: ' + times)
        const newComment = createCard(comments[i], data.currentUser, commentSection)
        //for (a = 0; a < comments[i].replies.length; a++) {
            //console.log('creating comment reply: ' + times)
            //createCard(comments[i].replies[a], data.currentUser, newComment.querySelector('.comment-replies'));
        reacurr(comments[i].replies, newComment);
        //}
    }
}