let data = null;

let votes = {};

const setData = () => {
    data = data_;
}

function upVoteComment(card) {
    card = card.closest('.comment-card');
    // Checks if card exists in votes object, or if the voted up property in the card value of votes object is true
    if (votes['card-' + card.id] == null || votes['card-' + card.id]['votedUp'] != 'true') {
        // If downvote has been pressed before, allow 2 up votes so that user can upvote/downvote at will
        if (votes['card-' + card.id] != null && 'votedDown' in votes['card-' + card.id]) {
            card.setAttribute('score', Number(card.getAttribute('score'))+1);
            votes['card-' + card.id] = {};
            return
        }
        // If there was no downvote, simply just add an upvote
        card.setAttribute('score', Number(card.getAttribute('score'))+1);
        votes['card-' + card.id] = {};
        votes['card-' + card.id]['votedUp'] = 'true';
    }
}
function downVoteComment(card) {
    card = card.closest('.comment-card');
    // Checks if card exists in votes object, or if the voted down property in the card value of votes object is true
    if (votes['card-' + card.id] == null || votes['card-' + card.id]['votedDown'] != 'true') {
        // If upvote has been pressed before, allow 2 down votes so that user can upvote/downvote at will
        if (votes['card-' + card.id] != null && 'votedUp' in votes['card-' + card.id]) {
            card.setAttribute('score', Number(card.getAttribute('score'))-1);
            votes['card-' + card.id] = {};
            return
        }
        // If there was no upvote, simply just add a downvote
        card.setAttribute('score', Number(card.getAttribute('score'))-1);
        votes['card-' + card.id] = {};
        votes['card-' + card.id]['votedDown'] = 'true';
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