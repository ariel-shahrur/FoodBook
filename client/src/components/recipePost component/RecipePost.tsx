import { FaRegClock, FaRegUser } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { FcCheckmark } from "react-icons/fc";
import { MdDelete } from 'react-icons/md';
import React, { useState } from 'react';
import { timeOptionsForSelectBox, ingredientsOptionsForSelectBox, servingOptionsForSelectBox } from '../../staticData';
import './recipePost.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { recipePost, RecipeInput, recipePostCharcterValidtion } from "../../interface/typs";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";


function RecipePost() {
  const navigate = useNavigate();
  const bearerToken = Cookies.get('token');
  const [ingredientsList, setIngredientsList] = useState<RecipeInput[]>([{ quantity: '', ingredient: '' }]);
  const [directionsList, setDirectionsList] = useState<string[]>(['']);
  const [selectedImages, setSelectedImages] = useState<FormData | null>(null);
  const [selectedImagesForDisplay, setSelectedImagesForDisplay] = useState<File[]>([]);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [count, setCount] = useState(0);
  const [charctersValidetion, setCharctersValidetion] = useState<recipePostCharcterValidtion>({
    recipeName: false,
    Description: false,
    ingredient: false,
    direction: false,
    quantity: false,
    allData: false,
  });

  const [recipeData, setRecipeData] = useState<recipePost>({
    recipeName: '',
    time: 0,
    ingredientsNum: 0,
    servingNum: 0,
    Description: '',
    likes: 0,
    ingredients: {},
    directions: {},
    images: new FormData()
  });
  const handleImageClick = (imageUrl: string, index: number) => {
    setCurrentImageIndex(index);
    setEnlargedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setEnlargedImage(null);
  };


  const handelForChangeEvent = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    var pattern = /^[a-zA-Z0-9'"., ()+!\n\/’` –:-]*$/;


    if (!pattern.test(e.target.value)) {
      setCharctersValidetion({ ...charctersValidetion, [e.target.name]: `Don't enter special characters except " or '` })
    }
    else {
      setCharctersValidetion({ ...charctersValidetion, [e.target.name]: false })
    }
    setRecipeData({ ...recipeData, [e.target.name]: e.target.value });
  }


  const directionIngredientChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'quantity' | 'ingredient' | "direction", index: number) => {
    var pattern = /^[a-zA-Z0-9'"., ()+!\n\/’` –:-]*$/;


    if (type === "direction") {
      if (!pattern.test(e.target.value)) {
        setCharctersValidetion({ ...charctersValidetion, [type]: `Don't enter special characters` })
      }
      else {
        setCharctersValidetion({ ...charctersValidetion, [type]: false })
      }
      const updatedDirectionsList = [...directionsList];
      updatedDirectionsList[index] = e.target.value.trim();
      setDirectionsList(updatedDirectionsList);
      return;
    }
    if (!pattern.test(e.target.value)) {
      setCharctersValidetion({ ...charctersValidetion, [type]: `Don't enter special characters` })
    }
    else {
      setCharctersValidetion({ ...charctersValidetion, [type]: false })
    }
    const updatedIngredientsList = [...ingredientsList];
    updatedIngredientsList[index][type] = e.target.value.trim();//{ quantity: '', ingredient: '' }
    setIngredientsList(updatedIngredientsList);
  };

  const addEmptyInput = (type: 'ingredient' | "direction") => { // Adds empty input by type
    if (charctersValidetion[type] || charctersValidetion.quantity) {
      return
    }
    if (type === "direction") {
      if (directionsList[directionsList.length - 1] === "") {
        setCharctersValidetion({ ...charctersValidetion, [type]: "You must provaide direction" })
        return;
      }
      setDirectionsList([...directionsList, '']);
      return;
    }
    if (ingredientsList[ingredientsList.length - 1].ingredient === "" || ingredientsList[ingredientsList.length - 1].quantity === "") {
      setCharctersValidetion({ ...charctersValidetion, [type]: "You must provaide ingredient and quantity" })
      return;
    }
    setIngredientsList([...ingredientsList, { quantity: '', ingredient: '' }]);
  };

  const addTitleByType = (type: 'ingredient' | "direction") => {
    if((charctersValidetion.ingredient==="You must provaid at least one ingredients list" ) && ingredientsList[0].ingredient !=="" && ingredientsList[0].quantity !==""){
      setCharctersValidetion({...charctersValidetion,ingredient:false});
    }
    if(charctersValidetion.direction==="You must provaid at least one directions list" && directionsList[0]!==""){
      setCharctersValidetion({...charctersValidetion,direction:false});
    }
    
    if ((charctersValidetion[type] || charctersValidetion.quantity) ) {
     return
    }
    if (type === "direction") {
      let directionTitelElemnt = (document.querySelector(".directionsTitleInput") as HTMLInputElement);
      let directionInputElemnt = (document.querySelector(".directionInput") as HTMLInputElement);
      if (directionTitelElemnt.value === "" || directionsList[directionsList.length - 1] === "") {
        return;
      }
      const updatedirections = {
        ...recipeData.directions,
        [directionTitelElemnt.value]: [...directionsList]
      }
      setRecipeData({ ...recipeData, directions: updatedirections })
      setDirectionsList(['']);
      [directionTitelElemnt.value, directionInputElemnt.value] = ["", ""];

    } else {
      let ingredientsTitleElemnt = (document.querySelector(".ingredientsTitleInput") as HTMLInputElement);
      let quantity = (document.querySelector(".quantityInput") as HTMLInputElement);
      let ingredient = (document.querySelector(".ingredientInput") as HTMLInputElement);
      if (ingredientsTitleElemnt.value === "") {
        return;
      }
      if (ingredientsList[0].ingredient === "" || ingredientsList[0].quantity === "" || ingredientsList[ingredientsList.length - 1].ingredient === "" || ingredientsList[ingredientsList.length - 1].quantity === "") {
        setCharctersValidetion({ ...charctersValidetion, [type]: `You must provide ingredient and quentity` })
        return;
      }
      else{
        setCharctersValidetion({ ...charctersValidetion, [type]: false })
      }
      const updateingredients = {
        ...recipeData.ingredients,
        [`${ingredientsTitleElemnt.value}`]: [...ingredientsList]
      }
      setRecipeData({ ...recipeData, ingredients: updateingredients })
      setIngredientsList([{ quantity: '', ingredient: '' }]);
      [ingredientsTitleElemnt.value, quantity.value, ingredient.value] = ["", "", ""];
    }
  };

  const previousBtn = () => {
    setCount(count - 1);
    if (count < 0) {
      setCount(0);
    }
    setIngredientsList([{ quantity: '', ingredient: '' }]);
    setDirectionsList(['']);
  };

  const nextBtn = () => {
    if (charctersValidetion.recipeName || charctersValidetion.Description || charctersValidetion.ingredient || charctersValidetion.direction) {
      return;
    }
    if (recipeData.recipeName === "" || recipeData.Description === "" || recipeData.time === 0 || recipeData.servingNum === 0) {
      setCharctersValidetion({ ...charctersValidetion, allData: "You must provaid all data" })
      return;
    }else{
      setCharctersValidetion({ ...charctersValidetion, allData: false })
    }
    if (count === 1 && Object.keys(recipeData.ingredients).length === 0) {
      setCharctersValidetion({ ...charctersValidetion, ingredient: "You must provaid at least one ingredients list" })
      return
    }
    if (count === 2 && Object.keys(recipeData.directions).length === 0) {
      setCharctersValidetion({ ...charctersValidetion, direction: "You must provaid at least one directions list" })
      return
    }
    setCount(count + 1);
    setIngredientsList([{ quantity: '', ingredient: '' }]);// reset befor
    setDirectionsList(['']);
  };


  const handleForUploadRecipe = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    fetch('http://127.0.0.1:3005/uploadrecipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${bearerToken}`
      },
      body: JSON.stringify(recipeData),
    })
      .then((recipeIdStr) => {
        return recipeIdStr.json()
      })
      .then(async (recipeIdObj) => {
        let recipeId = recipeIdObj.recipeId;
        if (selectedImages) {
          let newFormData = selectedImages;
          newFormData!.append("recipeId", recipeId);
          await fetch("http://127.0.0.1:3005/upload", {
            method: 'POST',
            body: newFormData,
            headers: {
              "Authorization": `Bearer ${bearerToken}`,
              "recipeID": recipeId
            }
          })
            .catch((err) => (err));
        }
      })

    setCount(4);
    setTimeout(() => {
      navigate('/feed')
    }, 2000);
  }

  const deleteByType = (title: string, type: string) => {
    if (type === "Ingredients" && recipeData.ingredients.hasOwnProperty(title)) {
      delete recipeData.ingredients[title];
      setRecipeData({
        ...recipeData,
        ingredients: recipeData.ingredients
      })
    } else {
      delete recipeData.directions[title];
      setRecipeData({
        ...recipeData,
        directions: recipeData.directions
      })
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let imageFiles = [];
    const filesInput = document.getElementById("imgInput") as HTMLInputElement;
    const formData = new FormData();
    if (filesInput && filesInput.files) {
      for (let i = 0; i < filesInput.files!.length; i++) {
        const file = filesInput.files[i];
        if (file.type.startsWith("image/")) {
          imageFiles.push(file);
          formData.append("files", file);
        }
      }
    }
    setSelectedImagesForDisplay(imageFiles);
    setSelectedImages(formData);
  }

  const deleteIngredientFromIngredientsList = (index: number,type:string) => {
    if(type==='direction'){
      let updateDirectionList = [...directionsList];
      updateDirectionList.splice(index, 1)
    setDirectionsList(updateDirectionList);
    return
    }

    let updateIngredientsList = [...ingredientsList];
    updateIngredientsList.splice(index, 1)
    setIngredientsList(updateIngredientsList);
  }

  return (<div className="recipePostBody">
    {count <= 3 && <div>
      {count === 0 && <div className="firstNotepad">
        <div className="top">
          <input type="text" name='recipeName' placeholder="recipe name" value={recipeData.recipeName} onChange={(e) => { handelForChangeEvent(e) }} />
          {charctersValidetion.recipeName && <div className="validetionMeesageDiv">{charctersValidetion.recipeName}</div>}
        </div>
        <div className="firstPaper">
          <div className='selectBoxsIconsDiv'>
            <div className="iconInput"><div className='iconDiv'>
              <FaRegClock size={25} />
              <div>{recipeData.time === 0 ? "" : recipeData.time} Minutes</div>
            </div>
              <select name='time' className='selectBoxRecipeFirstPage' onChange={(e) => { handelForChangeEvent(e) }} >
                <option  disabled selected >Select an option</option>
                {timeOptionsForSelectBox().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select></div>


            <div className="iconInput"><div className='iconDiv'>
              <IoBookOutline size={25} />
              <div>{recipeData.ingredientsNum === 0 ? "" : recipeData.ingredientsNum} Ingredients</div>
            </div>
              <select name="ingredientsNum" className='selectBoxRecipeFirstPage' onChange={(e) => { handelForChangeEvent(e) }}>
                <option  disabled selected>Select an option</option>
                {ingredientsOptionsForSelectBox().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="iconInput"><div className='iconDiv'>
              <FaRegUser size={25} />
              <div>{recipeData.servingNum === 0 ? "" : recipeData.servingNum} Peoples</div>
            </div>
              <select name="servingNum" className='selectBoxRecipeFirstPage' onChange={(e) => { handelForChangeEvent(e) }} >
                <option  disabled selected>Select an option</option>
                {servingOptionsForSelectBox().map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

          </div>
          <div className='descriptionDiv'>
            <h2>Tell Us About Your Recipe</h2>
            <textarea name="Description" id="textarea" cols={50} rows={10} placeholder='Describe Your Recipe' value={recipeData.Description} onChange={(e) => { handelForChangeEvent(e) }}></textarea>
            {charctersValidetion.Description && <div className="validetionMeesageDiv">{charctersValidetion.Description}</div>}
          </div>
          {charctersValidetion.allData && <div className="validetionMeesageDiv">{charctersValidetion.allData}</div>}
        </div>

      </div>}


      {/*==================================================Ingredients=========================================================== */}


      {count === 1 && <div className="IngredientsNotepad">
        <div className="top">
          <h1>Ingredients</h1>
        </div>
        <div className="IngredientsPaper">
          <h3 className='IngredientsHeadLine'>Ingredients:</h3>
          {Object.entries(recipeData.ingredients).map(([title, ingredients], index) => (
            <div key={index} className='recipePost-Ingredients'>
              <h4 className='IngredientsTitle'>For the {title}:</h4>
              <ul>
                {ingredients.map(({ quantity, ingredient }, idx) => {
                  return (<li key={idx}>{quantity} {ingredient}</li>)
                }
                )}
              </ul>
              <MdDelete className="delete-icon" onClick={() => deleteByType(title, "Ingredients")} />
            </div>
          ))}

          <div>For the<input type="text" placeholder='Ingredients Title' className='ingredientsTitleInput' /></div>

          {ingredientsList.map((input, index) => (
            <div key={index} className="inputIngredientsDiv">
              <input type="text" placeholder="quantity" className='quantityInput ' onChange={(e) => directionIngredientChange(e, 'quantity', index)} />
              <input type="text" placeholder="ingredient" className='ingredientInput ' onChange={(e) => directionIngredientChange(e, 'ingredient', index)} />
              {ingredientsList.length > 1 && <MdDelete size={10} className="ingrdient-delete-btn" onClick={() => { deleteIngredientFromIngredientsList(index,"ingredient") }} />}
            </div>
          ))}
          {(charctersValidetion.ingredient && <div className="validetionMeesageDiv">{charctersValidetion.ingredient}</div>) || (charctersValidetion.quantity && <div className="validetionMeesageDiv">{charctersValidetion.quantity}</div>)}
          <button className='add-input-btn' onClick={() => addEmptyInput("ingredient")}>Add ingredient</button>
          <button className='add-input-btn' onClick={() => addTitleByType("ingredient")}>Add Title</button>
        </div>
      </div>}

      {/*==================================================Directions=========================================================== */}
      {count === 2 && <div className="DirectionsNotepad">
        <div className="top">
          <h1>Directions</h1>
        </div>
        <div className="directionsPaper">
          <h3 className='DirectionsHeadLine'>How To Make {recipeData.recipeName}:</h3>
          {Object.entries(recipeData.directions).map(([title, directions], index) => (
            <div key={index} className='recipePost-Directions'>
              <h4 className='directionsTitle'>For the {title}:</h4>
              <ul>
                {directions.map((direction, idx) => {
                  if (direction !== "")
                  return (<li className="stepDirection" key={idx}>{direction}</li>)
                }
                )}
              </ul>
              <MdDelete className="delete-icon" onClick={() => deleteByType(title, "Directions")} />
            </div>
          ))}

          <div>For the<input type="text" placeholder="directions Title" className='directionsTitleInput directionsInput' /></div>

          {directionsList.map((input, index) => (
            <div key={`${index}s`} className="directionsInputDiv">
            <input key={index} type="text" className='directionInput directionsInput' onChange={(e) => directionIngredientChange(e, "direction", index)} placeholder="Direction" />
            {directionsList.length > 1 && <MdDelete size={10} className="directions-delete-btn" onClick={() => { deleteIngredientFromIngredientsList(index,"direction") }} />}
            </div>
            
            ))}
          <button className='add-input-btn' onClick={() => addEmptyInput("direction")}>Add direction</button>
          <button className='add-input-btn' onClick={() => addTitleByType("direction")}>Add directions Title</button>
          {charctersValidetion.direction && <div className="validetionMeesageDiv">{charctersValidetion.direction}</div>}
          <label htmlFor="imgInput" className="file-label">
            <span>Upload Images</span>
            <input id='imgInput' type='file' name='images' multiple onChange={(e) => { handleFileChange(e) }} />
          </label>
          {selectedImagesForDisplay && selectedImagesForDisplay.length > 0 && (
            <div>
              <div className="recipeImagesDiv">
                {selectedImagesForDisplay.map((image, index) => {
                  const imageUrl = URL.createObjectURL(image);
                  if (selectedImagesForDisplay.length > 4 && index > 2) {
                    if (index === 3) {
                      return <div key={index} className='numberDiv'>
                        <img className='numberImg'  src={imageUrl} alt="" />
                        <div className='numberOfImages' onClick={() => { handleImageClick(imageUrl, index) }}>+{selectedImagesForDisplay.length - 4}</div>
                      </div>
                    }
                    return;
                  }
                  return <img key={index} className="recipeImagesDivImg" src={imageUrl} alt={`Image ${index}`} />
                })}
              </div>
              {enlargedImage && (
                <div className="modal-overlay" >
                  {currentImageIndex > 0 && <GrFormPrevious className='prevNextIcon ' size={30} onClick={() => { handleImageClick(URL.createObjectURL(selectedImagesForDisplay[currentImageIndex - 1]), currentImageIndex - 1) }} />}
                  <img src={enlargedImage} alt="Enlarged View" className="modal-content" onClick={handleCloseModal} />
                  {currentImageIndex < selectedImagesForDisplay.length - 1 && <GrFormNext className='prevNextIcon ' size={30} onClick={() => { handleImageClick(URL.createObjectURL(selectedImagesForDisplay[currentImageIndex + 1]), currentImageIndex + 1) }} />}
                </div>
              )}
            </div>
          )}
        </div>

      </div>}

      {/*==================================================PreView=========================================================== */}
      {count === 3 && <div className="preViewNotepad">
        <div className="top"><h1>{recipeData.recipeName}</h1></div>
        <div className="preVIewPaper">
          <div className='iconsDiv' >
            <div className='iconDiv'>
              <FaRegClock size={25} />
              <div>{recipeData.time === 0 ? "" : recipeData.time} Minutes</div>
            </div>
            <div className='iconDiv'>
              <IoBookOutline size={25} />
              <div>{recipeData.ingredientsNum === 0 ? "" : recipeData.ingredientsNum} Ingredients</div>
            </div>
            <div className='iconDiv'>
              <FaRegUser size={25} />
              <div>{recipeData.servingNum === 0 ? "" : recipeData.servingNum} Peoples</div>
            </div></div>
          <h3 className='IngredientsHeadLine'>ingredients:</h3>
          {Object.entries(recipeData.ingredients).map(([title, ingredients], index) => (
            <div key={index}>
              <h4 className='IngredientsTitle'>For the {title}:</h4>
              <ul>
                {ingredients.map(({ quantity, ingredient }, idx) => {
                  if (ingredient !== "")
                    return (<li key={idx}>{quantity} {ingredient}</li>)
                }
                )}
              </ul>
            </div>
          ))}

          <h3 className='DirectionsHeadLine'>directions:</h3>
          {Object.entries(recipeData.directions).map(([title, directions], index) => (
            <div key={index}>
              <h4 className='directionsTitle'>{title}:</h4>
              <ul>
                {directions.map((direction, idx) => {
                  if (direction !== "")
                    return (<li className="stepDirection" key={idx}>{direction}</li>)
                }
                )}
              </ul>
            </div>
          ))}
          {selectedImagesForDisplay && selectedImagesForDisplay.length > 0 && (
            <div>
              <div className="recipeImagesDiv">
                {selectedImagesForDisplay.map((image, index) => {
                  const imageUrl = URL.createObjectURL(image);
                  if (selectedImagesForDisplay.length > 4 && index > 2) {
                    if (index === 3) {
                      return <div key={index} className='numberDiv'>
                        <img className='numberImg'  src={imageUrl} alt="" />
                        <div className='numberOfImages' onClick={() => { handleImageClick(imageUrl, index) }}>+{selectedImagesForDisplay.length - 4}</div>
                      </div>
                    }
                    return;
                  }
                  return <img  key={index} className="recipeImagesDivImg" src={imageUrl} alt={`Image ${index}`} />
                })}
              </div>
              {enlargedImage && (
                <div className="modal-overlay" >
                  {currentImageIndex > 0 && <GrFormPrevious className='prevNextIcon' size={30} onClick={() => { handleImageClick(URL.createObjectURL(selectedImagesForDisplay[currentImageIndex - 1]), currentImageIndex - 1) }} />}
                  <img src={enlargedImage} alt="Enlarged View" className="modal-content" onClick={handleCloseModal} />
                  {currentImageIndex < selectedImagesForDisplay.length - 1 && <GrFormNext className='prevNextIcon' size={30} onClick={() => { handleImageClick(URL.createObjectURL(selectedImagesForDisplay[currentImageIndex + 1]), currentImageIndex + 1) }} />}
                </div>
              )}
            </div>
          )}
        </div>
      </div>}



      <div className='flipBtnDiv'>
        {count !== 0 && <button className='flipBtnItem' onClick={previousBtn}>Previous</button>}
        {count < 2 && <button className='flipBtnItem' onClick={nextBtn}>Next</button>}
        {count === 2 && <button className='flipBtnItem' onClick={nextBtn}>diaply preview</button>}
        {count === 3 && <button className='flipBtnItem' onClick={(e) => { handleForUploadRecipe(e) }}>Upload Recipe</button>}
      </div>
    </div>}
    {count === 4 && <div className="Upload-Success-div" >
      <FcCheckmark className="checkmarkIcon" size={100} />
      <h2 className="Success__title">Upload Successful!</h2>
      <p className="Success__message">Your recipe has been uploaded. You can navigate to your feed.</p>
    </div>
    }
  </div>
  );
}

export default RecipePost;
