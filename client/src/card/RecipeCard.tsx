import React, { useEffect, useState } from 'react'
import { Recipe } from '../interface/typs';
import './recipeCard.css'
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { GrFormNext,GrFormPrevious } from "react-icons/gr";

function RecipeCard(props: { recipeData: Recipe }) {
    const currRecipe = props.recipeData;
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const handleImageClick = (imageUrl: string,index:number) => {
        setCurrentImageIndex(index);
        setEnlargedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setEnlargedImage(null);
    };

    return (<div><div className='recipeCardDiv'>
        <div className="recipeHeadline"><h1>{currRecipe.name}</h1></div>
        <div className="recipeCardPaper">
            <div className='iconsDiv'>
                <div className='iconDivItem'>
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
            <h3 className='ingredientsHeadline'>ingredients:</h3>
            {Object.entries(props.recipeData.ingredients).map(([title, ingredients], index) => (
                <div key={index}>
                    <h4 className='ingredientsTitle'>For the {title}:</h4>
                    <ul>
                        {ingredients.map(({ quantity, ingredient }, idx) => {
                            return (<li key={idx}>{quantity} {ingredient}</li>)
                        }
                        )}
                    </ul>
                </div>
            ))}

            <h3 className='directionsHeadline'>directions:</h3>
            {Object.entries(currRecipe.directions).map(([title, directions], index) => (
                <div key={index}>
                    <h4 className='directionsTitle'>{title}:</h4>
                    <ul>
                        {directions.map((direction, idx) => {
                            if (direction != "")
                                return (<li className="stepDirection" key={idx}>{direction}</li>)
                        }
                        )}
                    </ul>
                </div>
            ))}
            {currRecipe.images.length > 0 && <div className="recipeImagesDiv">
                {currRecipe.images.map((imageName: string, index) => {
                    const imageUrl = `http://127.0.0.1:3005/uploads/${imageName}`;
                    if (currRecipe.images.length > 4 && index > 2) {
                        if (index === 3) {
                            return <div key={imageName} className='numberDiv'>
                                <img className='numberImg' key={imageName} src={imageUrl} alt="" />
                                <div className='numberOfImages' onClick={() => { handleImageClick(imageUrl,index) }}>+{currRecipe.images.length-4}</div>
                            </div>
                        }
                        return;
                    }
                    return <img className='recipeImagesDivImg' key={imageName} src={imageUrl} alt="" onClick={() => {handleImageClick(imageUrl,index) }} />
                })}
            </div>}
        </div>
    </div>
        {enlargedImage && (
            <div className="modal-overlay" >
                {currentImageIndex>0 && <GrFormPrevious className='prevNextIcon ' size={30} onClick={()=>{handleImageClick(`http://127.0.0.1:3005/uploads/${currRecipe.images[currentImageIndex-1]}`,currentImageIndex-1)}}/>}
                <img src={enlargedImage} alt="Enlarged View" className="modal-content" onClick={handleCloseModal} />
                {currentImageIndex<currRecipe.images.length-1 && <GrFormNext className='prevNextIcon ' size={30} onClick={()=>{handleImageClick(`http://127.0.0.1:3005/uploads/${currRecipe.images[currentImageIndex+1]}`,currentImageIndex+1)}}/>}
            </div>
        )}
    </div>
    )
}

export default RecipeCard