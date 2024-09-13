import { StateCreator } from 'zustand'
import { Recipe } from '../types'
import { createRecipesSlice, RecipesSliceType } from './recipeSlice'
import { createNotificationSlice, NotificationSliceType } from './notificationSlice'

export type FavoritesSliceType = {
    favorites: Recipe[]
    handleClickFavorite: (recipe: Recipe) => void
    favoriteExists: (id:Recipe['idDrink']) => boolean
    loadFromStorage : () => void
}

export const createFavoritesSlice : StateCreator<FavoritesSliceType & RecipesSliceType & NotificationSliceType, [], [], FavoritesSliceType> = (set, get, api) => ({
    favorites: [],
    handleClickFavorite: (recipe) => {
        if(get().favoriteExists(recipe.idDrink)){
            //aqui se elimina
            set( (state) => ({
                favorites: state.favorites.filter( favorite => favorite.idDrink !== recipe.idDrink)
            }))
            createNotificationSlice(set, get, api).showNotification( {text: 'Se elimino de favoritos', error: false})
        }else {
            //aqui se agrega
            set((state) => ({
                favorites: [...state.favorites, recipe]
            })
        )
        createNotificationSlice(set, get, api).showNotification( {text: 'Se agrego a favoritos', error: false})
        }
        createRecipesSlice(set, get, api).closeModal()
        //se guarda o actualiza en LS
        localStorage.setItem('favorites', JSON.stringify(get().favorites))
    },
    favoriteExists: (id) => {
        return get().favorites.some( favorite => favorite.idDrink === id)
    },
    loadFromStorage: () => {
        const storagedFavorites = localStorage.getItem('favorites')
        if(storagedFavorites){
            set({
                favorites: JSON.parse(storagedFavorites)
            })
        }
    }
})