import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PendingApprovalController::index
 * @see app/Http/Controllers/PendingApprovalController.php:13
 * @route '/pending-approval'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pending-approval',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PendingApprovalController::index
 * @see app/Http/Controllers/PendingApprovalController.php:13
 * @route '/pending-approval'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PendingApprovalController::index
 * @see app/Http/Controllers/PendingApprovalController.php:13
 * @route '/pending-approval'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PendingApprovalController::index
 * @see app/Http/Controllers/PendingApprovalController.php:13
 * @route '/pending-approval'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PendingApprovalController::index
 * @see app/Http/Controllers/PendingApprovalController.php:13
 * @route '/pending-approval'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PendingApprovalController::index
 * @see app/Http/Controllers/PendingApprovalController.php:13
 * @route '/pending-approval'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PendingApprovalController::index
 * @see app/Http/Controllers/PendingApprovalController.php:13
 * @route '/pending-approval'
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
const PendingApprovalController = { index }

export default PendingApprovalController