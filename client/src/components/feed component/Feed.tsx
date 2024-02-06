import { FaRegClock, FaRegUser, FaRegComment } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineLike, AiTwotoneLike, AiFillLike } from "react-icons/ai";
import React, { useEffect, useState } from 'react'
import './feed.css'
import Cookies from 'js-cookie';
import { Recipe } from '../../interface/typs';
import RecipeCard from '../../card/RecipeCard';
import { MdDelete } from "react-icons/md";
import { dateConvert } from "../../staticData";
import { BiSend } from "react-icons/bi";

function Feed(props: { isADminConncted: boolean }) {
    const bearerToken = Cookies.get('token');
    const [recipeData, setRecipeData] = useState<Recipe[]>([]);
    const [recipeIdForDisplayComments, setRecipeIdForDisplayComments] = useState<number | null>(null);
    const [userId, setuserId] = useState<number>();
    const [selectedRecipeIdForDisplayRecipe, setSelectedRecipeIdForDisplayRecipe] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [commetsFromServer, setCommetsFromServer] = useState<{ id:number,recipe_id: number, comment: string, username: string,userId:number, commentDate: string }[]>([]);
    const [likesNumber, setLikesNumber] = useState(0);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [likedRecipesByUserId, setLikedRecipesByUserId] = useState(false);


    useEffect(() => {
        fetch("http://127.0.0.1:3005/feed", {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(feedDataStr => { return feedDataStr.json() })
            .then(feedDataObj => {
                setRecipeData(feedDataObj.feedData);
                setuserId(feedDataObj.userid);
            })
    }, []);

    const fetchToGetLikesNumberAndLikesByUser = async (recipeId: number) => {
        await fetch(`http://127.0.0.1:3005/feed/likesByUser?recipeId=${encodeURIComponent(recipeId)}`, {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
        })
            .then(feedDataStr => { return feedDataStr.json() })
            .then((feedDataObj: { likesNumberByUserId: number, likesNumberByRecipeId: number }) => {
                setLikesNumber(feedDataObj.likesNumberByRecipeId)
                if (feedDataObj.likesNumberByUserId > 0) {
                    setLikedRecipesByUserId(true)
                } else {
                    setLikedRecipesByUserId(false)
                }
            })
    }

    const displayAllRecipe = async (recipeId: number, comments: string[]) => {
        setCommentsNumber(comments.length);
        if (selectedRecipeIdForDisplayRecipe === recipeId) {
            setSelectedRecipeIdForDisplayRecipe(null);
        } else {
            setSelectedRecipeIdForDisplayRecipe(recipeId);
        }
        fetchToGetLikesNumberAndLikesByUser(recipeId)
    }

    const handleForLike = async (recipeId: number) => {
        await fetch('http://127.0.0.1:3005/feed/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({ "recipeId": recipeId }),
        })
            .then((response) => response.json())
            .then((data) => {
                setLikesNumber(data.likeResponse.likesNumber)
            });

        fetchToGetLikesNumberAndLikesByUser(recipeId)

    }

    const iconCommentClick = (recipeId: number) => {
        if (recipeIdForDisplayComments === recipeId) {
            setRecipeIdForDisplayComments(null);
        } else {
            setRecipeIdForDisplayComments(recipeId);
        }
        fetch(`http://127.0.0.1:3005/feed/allComment/${recipeId}`,)
            .then(commentsDataStr => { return commentsDataStr.json() })
            .then(commentsDataObj => {
                setCommetsFromServer(commentsDataObj);
            })
    }

    const handleForChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value)
    }

    const hanleForAddComment = async (recipeId: number) => {
        if (comment.trim() === "") {
            return;
        }
        await fetch('http://127.0.0.1:3005/feed/addComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ "recipeId": recipeId, "comment": comment }),
        })
            .then((response) => response.json())
            .then((data) => {
                setCommetsFromServer(data)
                setCommentsNumber(data.length)
            });
        setComment("")
    }

    const deleteRecipeFromFeed = async (recipeId: number) => {
        const updatedFavorite = recipeData.filter((item: Recipe) => item.id !== recipeId);
        setRecipeData(updatedFavorite);

        await fetch("http://127.0.0.1:3005/feed", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ recipeId }),
        })
    }

    const deleteCommentFromRecipe = async (commentId: number,recipeId:number) => {

        await fetch("http://127.0.0.1:3005/feed/comment", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify({ commentId,recipeId }),
        }).then(commentsDataStr=>{return commentsDataStr.json()})
        .then(commentsDataObj=>{
            setCommetsFromServer(commentsDataObj);
            setCommentsNumber(commentsDataObj.length)
        })
    }
    



    return (
        <div className='feedDiv'> {recipeData.map((currRecipe: Recipe) => {
            return (<div key={currRecipe.id} >
                {selectedRecipeIdForDisplayRecipe !== currRecipe.id ? <div className="shortRecipe">
                    <div className="top">
                        <h1>{currRecipe.name}</h1>
                    </div>
                    <div className="shortRecipePaper">
                        <div className='iconsDiv'>
                            <div className='iconDiv'>
                                <FaRegClock size={25} />
                                <div>{currRecipe.time} Minutes</div>
                            </div>
                            <div className='iconDiv'>
                                <IoBookOutline size={25} />
                                <div>{currRecipe.ingredientsNum} Ingredients</div>
                            </div>
                            <div className='iconDiv'>
                                <FaRegUser size={25} />
                                <div>{currRecipe.servingNum} Peoples</div>
                            </div>
                        </div>
                        <div className='descriptionDiv'>
                            {currRecipe.Description}
                        </div>
                    </div>
                    <div className='displayAllRecipeDiv'>
                        <button className='displayAllRecipeBtn' onClick={() => displayAllRecipe(currRecipe.id, currRecipe.comments)}>Display all recipe</button>
                    </div>
                </div>
                    : <div className="recipeNotepad">
                        {(props.isADminConncted || currRecipe.usernameId === userId) && <MdDelete className='delete-icon' onClick={() => { deleteRecipeFromFeed(currRecipe.id) }} />}
                        <RecipeCard recipeData={currRecipe} ></RecipeCard>
                        <div className='likes-comments-icons-Div'>
                            <div>{likesNumber} {!likedRecipesByUserId ? <AiOutlineLike className="icon" size={25} onClick={() => { handleForLike(currRecipe.id) }} /> : <AiFillLike color="rgb(80, 165, 235)" size={25} className="icon" onClick={() => { handleForLike(currRecipe.id) }} />}</div>
                            <div>{commentsNumber} <FaRegComment className="icon" size={25} onClick={() => { iconCommentClick(currRecipe.id) }} /></div>
                        </div>
                        {recipeIdForDisplayComments === currRecipe.id && <div className='commentsDiv'>
                            <div className='topComments'>
                                {commetsFromServer.map((currComment,index) => {
                                    if (currComment.recipe_id === currRecipe.id) {
                                        return (<div key={index} className='commentItemDiv'>
                                            {(props.isADminConncted || currComment.userId === userId) && <MdDelete size={10} className='delete-comment-icon' onClick={() => { deleteCommentFromRecipe(currComment.id,currComment.recipe_id) }} />}
                                            <div className='userName-date-commentDiv'>
                                                <div className='userName-comment'>{currComment.username}</div>
                                                <div className='date-comment'>{dateConvert(currComment.commentDate).date} {dateConvert(currComment.commentDate).time}</div>
                                            </div>
                                            {currComment.comment}
                                        </div>)
                                    }
                                })}
                            </div>
                            <div className='commentInputDiv'>
                                <input type="text" className='commentInput' value={comment} placeholder='write a comment' onChange={(e) => { handleForChangeComment(e) }} />
                                <BiSend size={30} className='addCommentBtn' onClick={() => { hanleForAddComment(currRecipe.id) }}/>
                            </div>
                        </div>
                        }
                    </div>}
            </div>
            )
        })}

        </div>
    )
}

export default Feed