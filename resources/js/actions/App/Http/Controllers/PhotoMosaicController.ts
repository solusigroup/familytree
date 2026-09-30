import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PhotoMosaicController::index
 * @see app/Http/Controllers/PhotoMosaicController.php:18
 * @route '/mosaic'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mosaic',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoMosaicController::index
 * @see app/Http/Controllers/PhotoMosaicController.php:18
 * @route '/mosaic'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoMosaicController::index
 * @see app/Http/Controllers/PhotoMosaicController.php:18
 * @route '/mosaic'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PhotoMosaicController::index
 * @see app/Http/Controllers/PhotoMosaicController.php:18
 * @route '/mosaic'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PhotoMosaicController::index
 * @see app/Http/Controllers/PhotoMosaicController.php:18
 * @route '/mosaic'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PhotoMosaicController::index
 * @see app/Http/Controllers/PhotoMosaicController.php:18
 * @route '/mosaic'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PhotoMosaicController::index
 * @see app/Http/Controllers/PhotoMosaicController.php:18
 * @route '/mosaic'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\PhotoMosaicController::store
 * @see app/Http/Controllers/PhotoMosaicController.php:49
 * @route '/mosaic'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mosaic',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PhotoMosaicController::store
 * @see app/Http/Controllers/PhotoMosaicController.php:49
 * @route '/mosaic'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoMosaicController::store
 * @see app/Http/Controllers/PhotoMosaicController.php:49
 * @route '/mosaic'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PhotoMosaicController::store
 * @see app/Http/Controllers/PhotoMosaicController.php:49
 * @route '/mosaic'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PhotoMosaicController::store
 * @see app/Http/Controllers/PhotoMosaicController.php:49
 * @route '/mosaic'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PhotoMosaicController::update
 * @see app/Http/Controllers/PhotoMosaicController.php:116
 * @route '/mosaic/{photoMosaic}'
 */
export const update = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/mosaic/{photoMosaic}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PhotoMosaicController::update
 * @see app/Http/Controllers/PhotoMosaicController.php:116
 * @route '/mosaic/{photoMosaic}'
 */
update.url = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { photoMosaic: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { photoMosaic: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    photoMosaic: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        photoMosaic: typeof args.photoMosaic === 'object'
                ? args.photoMosaic.id
                : args.photoMosaic,
                }

    return update.definition.url
            .replace('{photoMosaic}', parsedArgs.photoMosaic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoMosaicController::update
 * @see app/Http/Controllers/PhotoMosaicController.php:116
 * @route '/mosaic/{photoMosaic}'
 */
update.put = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PhotoMosaicController::update
 * @see app/Http/Controllers/PhotoMosaicController.php:116
 * @route '/mosaic/{photoMosaic}'
 */
    const updateForm = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PhotoMosaicController::update
 * @see app/Http/Controllers/PhotoMosaicController.php:116
 * @route '/mosaic/{photoMosaic}'
 */
        updateForm.put = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PhotoMosaicController::destroy
 * @see app/Http/Controllers/PhotoMosaicController.php:138
 * @route '/mosaic/{photoMosaic}'
 */
export const destroy = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/mosaic/{photoMosaic}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PhotoMosaicController::destroy
 * @see app/Http/Controllers/PhotoMosaicController.php:138
 * @route '/mosaic/{photoMosaic}'
 */
destroy.url = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { photoMosaic: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { photoMosaic: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    photoMosaic: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        photoMosaic: typeof args.photoMosaic === 'object'
                ? args.photoMosaic.id
                : args.photoMosaic,
                }

    return destroy.definition.url
            .replace('{photoMosaic}', parsedArgs.photoMosaic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoMosaicController::destroy
 * @see app/Http/Controllers/PhotoMosaicController.php:138
 * @route '/mosaic/{photoMosaic}'
 */
destroy.delete = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PhotoMosaicController::destroy
 * @see app/Http/Controllers/PhotoMosaicController.php:138
 * @route '/mosaic/{photoMosaic}'
 */
    const destroyForm = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PhotoMosaicController::destroy
 * @see app/Http/Controllers/PhotoMosaicController.php:138
 * @route '/mosaic/{photoMosaic}'
 */
        destroyForm.delete = (args: { photoMosaic: number | { id: number } } | [photoMosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PhotoMosaicController = { index, store, update, destroy }

export default PhotoMosaicController