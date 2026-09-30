import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
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
* @see \App\Http\Controllers\ChatController::fetchMessages
 * @see app/Http/Controllers/ChatController.php:78
 * @route '/chat/messages'
 */
export const fetchMessages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fetchMessages.url(options),
    method: 'get',
})

fetchMessages.definition = {
    methods: ["get","head"],
    url: '/chat/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChatController::fetchMessages
 * @see app/Http/Controllers/ChatController.php:78
 * @route '/chat/messages'
 */
fetchMessages.url = (options?: RouteQueryOptions) => {
    return fetchMessages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::fetchMessages
 * @see app/Http/Controllers/ChatController.php:78
 * @route '/chat/messages'
 */
fetchMessages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fetchMessages.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ChatController::fetchMessages
 * @see app/Http/Controllers/ChatController.php:78
 * @route '/chat/messages'
 */
fetchMessages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fetchMessages.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ChatController::fetchMessages
 * @see app/Http/Controllers/ChatController.php:78
 * @route '/chat/messages'
 */
    const fetchMessagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: fetchMessages.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ChatController::fetchMessages
 * @see app/Http/Controllers/ChatController.php:78
 * @route '/chat/messages'
 */
        fetchMessagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fetchMessages.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ChatController::fetchMessages
 * @see app/Http/Controllers/ChatController.php:78
 * @route '/chat/messages'
 */
        fetchMessagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fetchMessages.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    fetchMessages.form = fetchMessagesForm
/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:106
 * @route '/chat'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:106
 * @route '/chat'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:106
 * @route '/chat'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:106
 * @route '/chat'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:106
 * @route '/chat'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:147
 * @route '/chat/{chatMessage}'
 */
export const destroy = (args: { chatMessage: number | { id: number } } | [chatMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/chat/{chatMessage}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:147
 * @route '/chat/{chatMessage}'
 */
destroy.url = (args: { chatMessage: number | { id: number } } | [chatMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chatMessage: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { chatMessage: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    chatMessage: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chatMessage: typeof args.chatMessage === 'object'
                ? args.chatMessage.id
                : args.chatMessage,
                }

    return destroy.definition.url
            .replace('{chatMessage}', parsedArgs.chatMessage.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:147
 * @route '/chat/{chatMessage}'
 */
destroy.delete = (args: { chatMessage: number | { id: number } } | [chatMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:147
 * @route '/chat/{chatMessage}'
 */
    const destroyForm = (args: { chatMessage: number | { id: number } } | [chatMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:147
 * @route '/chat/{chatMessage}'
 */
        destroyForm.delete = (args: { chatMessage: number | { id: number } } | [chatMessage: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ChatController = { index, fetchMessages, store, destroy }

export default ChatController