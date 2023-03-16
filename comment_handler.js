let data = null;

let votes = sessionStorage.getItem('votes');
if (votes === null || votes == 'null') {
    sessionStorage.setItem('votes', JSON.stringify({}));
    votes = {};
} else {
    votes = JSON.parse(votes);
}

const setData = () => {
    data = data_;
}

function updateSessionCardScore(card) {
    console.log('hi')
    const commentsData = JSON.parse(sessionStorage.getItem('comments'));
    const reacurr = function(parent) {
        parent.forEach((comment, index) => {
            if (comment.id == Number(card.id.toString().split('card-')[1])) {
                comment.score = Number(card.getAttribute('score'));
                return;
            }
            reacurr(comment.replies);
        })
    }
    reacurr(commentsData);
    sessionStorage.setItem('comments', JSON.stringify(commentsData));
    sessionStorage.setItem('votes', JSON.stringify(votes));
}

function setVoteState(button, state) {
    if (state === true) {
        button.style.filter = 'saturate(3000%)'
    } else if (state === false) {
        button.style.removeProperty('filter');
    } else {
        button.style.removeProperty('filter');
    }
}

let loadAttemptInterval = null;
function loadVotes() {
    for (let object in votes) {
        try{
            if (votes[object].votedUp) {
                const objId = object;
                document.getElementById(objId.toString()).querySelectorAll('.upvote-comment-button').forEach(element => {
                    if (element.closest('.comment-card').id == objId) {
                        setVoteState(element, true);
                    }
                })
            } else if (votes[object].votedDown) {
                const objId = object;
                document.getElementById(objId.toString()).querySelectorAll('.downvote-comment-button').forEach(element => {
                    if (element.closest('.comment-card').id == objId) {
                        setVoteState(element, true);
                    }
                })
            }
            clearInterval(loadAttemptInterval);
        } catch(err) {
            console.log(err)
            clearInterval(loadAttemptInterval);
        }
    }
}

window.onload = function() {
    loadAttemptInterval = setInterval(loadVotes, 200)
}

function upVoteComment(card) {
    const button = card;
    card = card.closest('.comment-card');
    // Checks if card exists in votes object, or if the voted up property in the card value of votes object is true
    if (!Object.keys(votes).includes(card.id) || votes[card.id]['votedUp'] != 'true') {
        // If downvote has been pressed before, allow 2 up votes so that user can upvote/downvote at will
        if (votes[card.id] != null && 'votedDown' in votes[card.id]) {
            setVoteState(button, false);
            setVoteState(button.nextElementSibling.nextElementSibling, false);
            card.setAttribute('score', Number(card.getAttribute('score'))+1);
            votes[card.id] = {};
            updateSessionCardScore(card);
            return
        }
        setVoteState(button, true);
        setVoteState(button.nextElementSibling.nextElementSibling, false);
        // If there was no downvote, simply just add an upvote
        card.setAttribute('score', Number(card.getAttribute('score'))+1);
        votes[card.id] = {};
        votes[card.id]['votedUp'] = 'true';
        updateSessionCardScore(card);
    }
}
function downVoteComment(card) {
    const button = card;
    card = card.closest('.comment-card');
    // Checks if card exists in votes object, or if the voted down property in the card value of votes object is true
    if (votes[card.id] == null || votes[card.id]['votedDown'] != 'true') {
        // If upvote has been pressed before, allow 2 down votes so that user can upvote/downvote at will
        if (votes[card.id] != null && 'votedUp' in votes[card.id]) {
            setVoteState(button, false);
            setVoteState(button.previousElementSibling.previousElementSibling, false);
            card.setAttribute('score', Number(card.getAttribute('score'))-1);
            votes[card.id] = {};
            updateSessionCardScore(card);
            return
        }
        // If there was no upvote, simply just add a downvote
        card.setAttribute('score', Number(card.getAttribute('score'))-1);
        votes[card.id] = {};
        votes[card.id]['votedDown'] = 'true';
        setVoteState(button, true);
        setVoteState(button.previousElementSibling.previousElementSibling, false);
        updateSessionCardScore(card);
    }
}






function deleteCommentConfirmation(card) {
    if (card.querySelector('.comment-poster').textContent === data.currentUser.username) {
        document.querySelector('#black-overlay').style.display = 'block';
        document.querySelector('#confirm-deletion').style.display = 'block';
        commentToBeDeleted = card;
    }
}

function reset() {
    sessionStorage.setItem('comments', null);
    sessionStorage.setItem('votes', null);
}
function get() {
    console.log(JSON.parse(sessionStorage.getItem('comments')));
}

function deleteComment() {
    const oldId = commentToBeDeleted.id;
    commentToBeDeleted.remove();
    document.querySelectorAll('.comment-card').forEach(card => {
        if (Number(card.id) > oldId) {
            card.id = Number(card.id) - 1;
        }
    })
    document.querySelector('#black-overlay').style.display = 'none';
    document.querySelector('#confirm-deletion').style.display = 'none';

    // Delete comment in local/session storage
    const commentsData = JSON.parse(sessionStorage.getItem('comments'));
    const reacurr = function(parent) {
        parent.forEach((comment, index) => {
            if (comment.id == Number(oldId)) {
                parent.splice(index, 1);
                return;
            }
            reacurr(comment.replies);
        })
    }
    reacurr(commentsData);
    sessionStorage.setItem('comments', JSON.stringify(commentsData));
    commentToBeDeleted = null;
}

function cancelCommentDeletion() {
    document.querySelector('#black-overlay').style.display = 'none';
    document.querySelector('#confirm-deletion').style.display = 'none';
    commentToBeDeleted = null;
}

function sendComment() {
    if (commentText.value.trim().length <= 0) { return };
    dataToSend = {
        "content": commentText.value,
        "createdAt": 'Just now',
        "id": currentId,
        "user": {
            "username": data.currentUser.username,
            "image": {
                "webp": data.currentUser.image.webp,
                "png": data.currentUser.image.png,
            },
        },
        "score": 0,
        'replies': [],
    }
    createCard(dataToSend, data.currentUser, commentSection);
    commentText.value = '';
}

function openReplyFrame(card) {
    const replyFrame = card.querySelector('.create-reply-frame');
    const profilePicture = replyFrame.querySelector('.comment-profile-picture');
    profilePicture.src = data.currentUser.image.png;
    replyFrame.style.display = 'flex';
    replyFrame.querySelector('.reply-comment-text').focus();
}

function cancelReplyFrame(card) {
    const replyFrame = card.querySelector('.create-reply-frame');
    replyFrame.style.display = 'none';
    replyFrame.querySelector('.reply-comment-text').value = '';
}

function sendReply(card) {
    const replyFrame = card.querySelector('.create-reply-frame');
    const replyText = replyFrame.querySelector('.reply-comment-text')
    if (replyText.value.trim().length <= 0) { return };
    dataToSend = {
        "content": replyText.value,
        "createdAt": 'Just now',
        "id": currentId,
        "user": {
            "username": data.currentUser.username,
            "image": {
                "webp": data.currentUser.image.webp,
                "png": data.currentUser.image.png,
            },
        },
        "replyingTo": 'none',
        "score": 0,
        "replies": [],
    }
    createCard(dataToSend, data.currentUser, card.querySelector('.comment-replies'));
    cancelReplyFrame(card);
}

function editComment(card) {
    if (card.querySelector('.comment-poster').textContent === data.currentUser.username) {
        const editFrame = card.querySelector('.comment-edit-frame');
        const mainTextFrame = card.querySelector('.main-comment-text');
        const editText = editFrame.querySelector('.main-comment-text-edit');
        if (card.classList.contains('editing')) {
            mainTextFrame.style.display = 'block';
            editFrame.style.display = 'none';
            card.classList.remove('editing');
            return;
        }
        editText.value = mainTextFrame.textContent;
        card.classList.add('editing');
        mainTextFrame.style.display = 'none';
        editFrame.style.display = 'flex';
    }
}

function updateComment(card) {
    const editFrame = card.querySelector('.comment-edit-frame');
    const mainTextFrame = card.querySelector('.main-comment-text');
    if (!card.classList.contains('editing')) { return }
    if (editFrame.querySelector('.main-comment-text-edit').value.trim().length <= 0) { return };
    mainTextFrame.textContent = editFrame.querySelector('.main-comment-text-edit').value;
    editFrame.style.removeProperty('display');
    mainTextFrame.style.removeProperty('display');
    card.classList.remove('editing');

    const commentsData = JSON.parse(sessionStorage.getItem('comments'));
    const reacurr = function(parent) {
        parent.forEach((comment) => {
            if (comment.id == Number(card.id)) {
                comment.content = mainTextFrame.textContent;
                return;
            }
            reacurr(comment.replies);
        })
    }
    reacurr(commentsData);
    sessionStorage.setItem('comments', JSON.stringify(commentsData));
}

function cancelCommentEdit(card) {
    card.querySelector('.comment-edit-frame').style.removeProperty('display');
    card.querySelector('.main-comment-text').style.removeProperty('display');
    card.classList.remove('editing');
}