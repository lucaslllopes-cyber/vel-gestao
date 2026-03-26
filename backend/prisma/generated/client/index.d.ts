
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Lote
 * 
 */
export type Lote = $Result.DefaultSelection<Prisma.$LotePayload>
/**
 * Model Proposta
 * 
 */
export type Proposta = $Result.DefaultSelection<Prisma.$PropostaPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.lote`: Exposes CRUD operations for the **Lote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lotes
    * const lotes = await prisma.lote.findMany()
    * ```
    */
  get lote(): Prisma.LoteDelegate<ExtArgs>;

  /**
   * `prisma.proposta`: Exposes CRUD operations for the **Proposta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Propostas
    * const propostas = await prisma.proposta.findMany()
    * ```
    */
  get proposta(): Prisma.PropostaDelegate<ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.0.0
   * Query Engine version: 5dbef10bdbfb579e07d35cc85fb1518d357cb99e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Lote: 'Lote',
    Proposta: 'Proposta',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "lote" | "proposta" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Lote: {
        payload: Prisma.$LotePayload<ExtArgs>
        fields: Prisma.LoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          findFirst: {
            args: Prisma.LoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          findMany: {
            args: Prisma.LoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>[]
          }
          create: {
            args: Prisma.LoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          createMany: {
            args: Prisma.LoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>[]
          }
          delete: {
            args: Prisma.LoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          update: {
            args: Prisma.LoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          deleteMany: {
            args: Prisma.LoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotePayload>
          }
          aggregate: {
            args: Prisma.LoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLote>
          }
          groupBy: {
            args: Prisma.LoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoteCountArgs<ExtArgs>
            result: $Utils.Optional<LoteCountAggregateOutputType> | number
          }
        }
      }
      Proposta: {
        payload: Prisma.$PropostaPayload<ExtArgs>
        fields: Prisma.PropostaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropostaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropostaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>
          }
          findFirst: {
            args: Prisma.PropostaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropostaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>
          }
          findMany: {
            args: Prisma.PropostaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>[]
          }
          create: {
            args: Prisma.PropostaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>
          }
          createMany: {
            args: Prisma.PropostaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropostaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>[]
          }
          delete: {
            args: Prisma.PropostaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>
          }
          update: {
            args: Prisma.PropostaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>
          }
          deleteMany: {
            args: Prisma.PropostaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropostaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PropostaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropostaPayload>
          }
          aggregate: {
            args: Prisma.PropostaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProposta>
          }
          groupBy: {
            args: Prisma.PropostaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropostaGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropostaCountArgs<ExtArgs>
            result: $Utils.Optional<PropostaCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    lotes: number
    propostas: number
    auditLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lotes?: boolean | UserCountOutputTypeCountLotesArgs
    propostas?: boolean | UserCountOutputTypeCountPropostasArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPropostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropostaWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type LoteCountOutputType
   */

  export type LoteCountOutputType = {
    propostas: number
    auditLogs: number
  }

  export type LoteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    propostas?: boolean | LoteCountOutputTypeCountPropostasArgs
    auditLogs?: boolean | LoteCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * LoteCountOutputType without action
   */
  export type LoteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoteCountOutputType
     */
    select?: LoteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LoteCountOutputType without action
   */
  export type LoteCountOutputTypeCountPropostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropostaWhereInput
  }

  /**
   * LoteCountOutputType without action
   */
  export type LoteCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    nome: string | null
    login: string | null
    senhaHash: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    login: string | null
    senhaHash: string | null
    role: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    nome: number
    login: number
    senhaHash: number
    role: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    nome?: true
    login?: true
    senhaHash?: true
    role?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    nome?: true
    login?: true
    senhaHash?: true
    role?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    nome?: true
    login?: true
    senhaHash?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    nome: string
    login: string
    senhaHash: string
    role: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    login?: boolean
    senhaHash?: boolean
    role?: boolean
    createdAt?: boolean
    lotes?: boolean | User$lotesArgs<ExtArgs>
    propostas?: boolean | User$propostasArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    login?: boolean
    senhaHash?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    nome?: boolean
    login?: boolean
    senhaHash?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lotes?: boolean | User$lotesArgs<ExtArgs>
    propostas?: boolean | User$propostasArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      lotes: Prisma.$LotePayload<ExtArgs>[]
      propostas: Prisma.$PropostaPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      login: string
      senhaHash: string
      role: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lotes<T extends User$lotesArgs<ExtArgs> = {}>(args?: Subset<T, User$lotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findMany"> | Null>
    propostas<T extends User$propostasArgs<ExtArgs> = {}>(args?: Subset<T, User$propostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly nome: FieldRef<"User", 'String'>
    readonly login: FieldRef<"User", 'String'>
    readonly senhaHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.lotes
   */
  export type User$lotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    where?: LoteWhereInput
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    cursor?: LoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * User.propostas
   */
  export type User$propostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    where?: PropostaWhereInput
    orderBy?: PropostaOrderByWithRelationInput | PropostaOrderByWithRelationInput[]
    cursor?: PropostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropostaScalarFieldEnum | PropostaScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Lote
   */

  export type AggregateLote = {
    _count: LoteCountAggregateOutputType | null
    _avg: LoteAvgAggregateOutputType | null
    _sum: LoteSumAggregateOutputType | null
    _min: LoteMinAggregateOutputType | null
    _max: LoteMaxAggregateOutputType | null
  }

  export type LoteAvgAggregateOutputType = {
    area: number | null
    valor: number | null
  }

  export type LoteSumAggregateOutputType = {
    area: number | null
    valor: number | null
  }

  export type LoteMinAggregateOutputType = {
    id: string | null
    n: string | null
    q: string | null
    area: number | null
    valor: number | null
    status: string | null
    reservaVenceEm: Date | null
    comprador: string | null
    compradorAnterior: string | null
    reservaOwnerId: string | null
  }

  export type LoteMaxAggregateOutputType = {
    id: string | null
    n: string | null
    q: string | null
    area: number | null
    valor: number | null
    status: string | null
    reservaVenceEm: Date | null
    comprador: string | null
    compradorAnterior: string | null
    reservaOwnerId: string | null
  }

  export type LoteCountAggregateOutputType = {
    id: number
    n: number
    q: number
    area: number
    valor: number
    status: number
    reservaVenceEm: number
    comprador: number
    compradorAnterior: number
    reservaOwnerId: number
    _all: number
  }


  export type LoteAvgAggregateInputType = {
    area?: true
    valor?: true
  }

  export type LoteSumAggregateInputType = {
    area?: true
    valor?: true
  }

  export type LoteMinAggregateInputType = {
    id?: true
    n?: true
    q?: true
    area?: true
    valor?: true
    status?: true
    reservaVenceEm?: true
    comprador?: true
    compradorAnterior?: true
    reservaOwnerId?: true
  }

  export type LoteMaxAggregateInputType = {
    id?: true
    n?: true
    q?: true
    area?: true
    valor?: true
    status?: true
    reservaVenceEm?: true
    comprador?: true
    compradorAnterior?: true
    reservaOwnerId?: true
  }

  export type LoteCountAggregateInputType = {
    id?: true
    n?: true
    q?: true
    area?: true
    valor?: true
    status?: true
    reservaVenceEm?: true
    comprador?: true
    compradorAnterior?: true
    reservaOwnerId?: true
    _all?: true
  }

  export type LoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lote to aggregate.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lotes
    **/
    _count?: true | LoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoteMaxAggregateInputType
  }

  export type GetLoteAggregateType<T extends LoteAggregateArgs> = {
        [P in keyof T & keyof AggregateLote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLote[P]>
      : GetScalarType<T[P], AggregateLote[P]>
  }




  export type LoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoteWhereInput
    orderBy?: LoteOrderByWithAggregationInput | LoteOrderByWithAggregationInput[]
    by: LoteScalarFieldEnum[] | LoteScalarFieldEnum
    having?: LoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoteCountAggregateInputType | true
    _avg?: LoteAvgAggregateInputType
    _sum?: LoteSumAggregateInputType
    _min?: LoteMinAggregateInputType
    _max?: LoteMaxAggregateInputType
  }

  export type LoteGroupByOutputType = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm: Date | null
    comprador: string | null
    compradorAnterior: string | null
    reservaOwnerId: string | null
    _count: LoteCountAggregateOutputType | null
    _avg: LoteAvgAggregateOutputType | null
    _sum: LoteSumAggregateOutputType | null
    _min: LoteMinAggregateOutputType | null
    _max: LoteMaxAggregateOutputType | null
  }

  type GetLoteGroupByPayload<T extends LoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoteGroupByOutputType[P]>
            : GetScalarType<T[P], LoteGroupByOutputType[P]>
        }
      >
    >


  export type LoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    n?: boolean
    q?: boolean
    area?: boolean
    valor?: boolean
    status?: boolean
    reservaVenceEm?: boolean
    comprador?: boolean
    compradorAnterior?: boolean
    reservaOwnerId?: boolean
    reservaOwner?: boolean | Lote$reservaOwnerArgs<ExtArgs>
    propostas?: boolean | Lote$propostasArgs<ExtArgs>
    auditLogs?: boolean | Lote$auditLogsArgs<ExtArgs>
    _count?: boolean | LoteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lote"]>

  export type LoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    n?: boolean
    q?: boolean
    area?: boolean
    valor?: boolean
    status?: boolean
    reservaVenceEm?: boolean
    comprador?: boolean
    compradorAnterior?: boolean
    reservaOwnerId?: boolean
    reservaOwner?: boolean | Lote$reservaOwnerArgs<ExtArgs>
  }, ExtArgs["result"]["lote"]>

  export type LoteSelectScalar = {
    id?: boolean
    n?: boolean
    q?: boolean
    area?: boolean
    valor?: boolean
    status?: boolean
    reservaVenceEm?: boolean
    comprador?: boolean
    compradorAnterior?: boolean
    reservaOwnerId?: boolean
  }

  export type LoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservaOwner?: boolean | Lote$reservaOwnerArgs<ExtArgs>
    propostas?: boolean | Lote$propostasArgs<ExtArgs>
    auditLogs?: boolean | Lote$auditLogsArgs<ExtArgs>
    _count?: boolean | LoteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reservaOwner?: boolean | Lote$reservaOwnerArgs<ExtArgs>
  }

  export type $LotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lote"
    objects: {
      reservaOwner: Prisma.$UserPayload<ExtArgs> | null
      propostas: Prisma.$PropostaPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      n: string
      q: string
      area: number
      valor: number
      status: string
      reservaVenceEm: Date | null
      comprador: string | null
      compradorAnterior: string | null
      reservaOwnerId: string | null
    }, ExtArgs["result"]["lote"]>
    composites: {}
  }

  type LoteGetPayload<S extends boolean | null | undefined | LoteDefaultArgs> = $Result.GetResult<Prisma.$LotePayload, S>

  type LoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LoteCountAggregateInputType | true
    }

  export interface LoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lote'], meta: { name: 'Lote' } }
    /**
     * Find zero or one Lote that matches the filter.
     * @param {LoteFindUniqueArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoteFindUniqueArgs>(args: SelectSubset<T, LoteFindUniqueArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Lote that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LoteFindUniqueOrThrowArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoteFindUniqueOrThrowArgs>(args: SelectSubset<T, LoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Lote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteFindFirstArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoteFindFirstArgs>(args?: SelectSubset<T, LoteFindFirstArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Lote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteFindFirstOrThrowArgs} args - Arguments to find a Lote
     * @example
     * // Get one Lote
     * const lote = await prisma.lote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoteFindFirstOrThrowArgs>(args?: SelectSubset<T, LoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Lotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lotes
     * const lotes = await prisma.lote.findMany()
     * 
     * // Get first 10 Lotes
     * const lotes = await prisma.lote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loteWithIdOnly = await prisma.lote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoteFindManyArgs>(args?: SelectSubset<T, LoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Lote.
     * @param {LoteCreateArgs} args - Arguments to create a Lote.
     * @example
     * // Create one Lote
     * const Lote = await prisma.lote.create({
     *   data: {
     *     // ... data to create a Lote
     *   }
     * })
     * 
     */
    create<T extends LoteCreateArgs>(args: SelectSubset<T, LoteCreateArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Lotes.
     * @param {LoteCreateManyArgs} args - Arguments to create many Lotes.
     * @example
     * // Create many Lotes
     * const lote = await prisma.lote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoteCreateManyArgs>(args?: SelectSubset<T, LoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lotes and returns the data saved in the database.
     * @param {LoteCreateManyAndReturnArgs} args - Arguments to create many Lotes.
     * @example
     * // Create many Lotes
     * const lote = await prisma.lote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lotes and only return the `id`
     * const loteWithIdOnly = await prisma.lote.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoteCreateManyAndReturnArgs>(args?: SelectSubset<T, LoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Lote.
     * @param {LoteDeleteArgs} args - Arguments to delete one Lote.
     * @example
     * // Delete one Lote
     * const Lote = await prisma.lote.delete({
     *   where: {
     *     // ... filter to delete one Lote
     *   }
     * })
     * 
     */
    delete<T extends LoteDeleteArgs>(args: SelectSubset<T, LoteDeleteArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Lote.
     * @param {LoteUpdateArgs} args - Arguments to update one Lote.
     * @example
     * // Update one Lote
     * const lote = await prisma.lote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoteUpdateArgs>(args: SelectSubset<T, LoteUpdateArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Lotes.
     * @param {LoteDeleteManyArgs} args - Arguments to filter Lotes to delete.
     * @example
     * // Delete a few Lotes
     * const { count } = await prisma.lote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoteDeleteManyArgs>(args?: SelectSubset<T, LoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lotes
     * const lote = await prisma.lote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoteUpdateManyArgs>(args: SelectSubset<T, LoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Lote.
     * @param {LoteUpsertArgs} args - Arguments to update or create a Lote.
     * @example
     * // Update or create a Lote
     * const lote = await prisma.lote.upsert({
     *   create: {
     *     // ... data to create a Lote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lote we want to update
     *   }
     * })
     */
    upsert<T extends LoteUpsertArgs>(args: SelectSubset<T, LoteUpsertArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Lotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteCountArgs} args - Arguments to filter Lotes to count.
     * @example
     * // Count the number of Lotes
     * const count = await prisma.lote.count({
     *   where: {
     *     // ... the filter for the Lotes we want to count
     *   }
     * })
    **/
    count<T extends LoteCountArgs>(
      args?: Subset<T, LoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoteAggregateArgs>(args: Subset<T, LoteAggregateArgs>): Prisma.PrismaPromise<GetLoteAggregateType<T>>

    /**
     * Group by Lote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoteGroupByArgs['orderBy'] }
        : { orderBy?: LoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lote model
   */
  readonly fields: LoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reservaOwner<T extends Lote$reservaOwnerArgs<ExtArgs> = {}>(args?: Subset<T, Lote$reservaOwnerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    propostas<T extends Lote$propostasArgs<ExtArgs> = {}>(args?: Subset<T, Lote$propostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "findMany"> | Null>
    auditLogs<T extends Lote$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Lote$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lote model
   */ 
  interface LoteFieldRefs {
    readonly id: FieldRef<"Lote", 'String'>
    readonly n: FieldRef<"Lote", 'String'>
    readonly q: FieldRef<"Lote", 'String'>
    readonly area: FieldRef<"Lote", 'Float'>
    readonly valor: FieldRef<"Lote", 'Float'>
    readonly status: FieldRef<"Lote", 'String'>
    readonly reservaVenceEm: FieldRef<"Lote", 'DateTime'>
    readonly comprador: FieldRef<"Lote", 'String'>
    readonly compradorAnterior: FieldRef<"Lote", 'String'>
    readonly reservaOwnerId: FieldRef<"Lote", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Lote findUnique
   */
  export type LoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote findUniqueOrThrow
   */
  export type LoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote findFirst
   */
  export type LoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lotes.
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lotes.
     */
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * Lote findFirstOrThrow
   */
  export type LoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lote to fetch.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lotes.
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lotes.
     */
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * Lote findMany
   */
  export type LoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter, which Lotes to fetch.
     */
    where?: LoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lotes to fetch.
     */
    orderBy?: LoteOrderByWithRelationInput | LoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lotes.
     */
    cursor?: LoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lotes.
     */
    skip?: number
    distinct?: LoteScalarFieldEnum | LoteScalarFieldEnum[]
  }

  /**
   * Lote create
   */
  export type LoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Lote.
     */
    data: XOR<LoteCreateInput, LoteUncheckedCreateInput>
  }

  /**
   * Lote createMany
   */
  export type LoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lotes.
     */
    data: LoteCreateManyInput | LoteCreateManyInput[]
  }

  /**
   * Lote createManyAndReturn
   */
  export type LoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Lotes.
     */
    data: LoteCreateManyInput | LoteCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lote update
   */
  export type LoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Lote.
     */
    data: XOR<LoteUpdateInput, LoteUncheckedUpdateInput>
    /**
     * Choose, which Lote to update.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote updateMany
   */
  export type LoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lotes.
     */
    data: XOR<LoteUpdateManyMutationInput, LoteUncheckedUpdateManyInput>
    /**
     * Filter which Lotes to update
     */
    where?: LoteWhereInput
  }

  /**
   * Lote upsert
   */
  export type LoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Lote to update in case it exists.
     */
    where: LoteWhereUniqueInput
    /**
     * In case the Lote found by the `where` argument doesn't exist, create a new Lote with this data.
     */
    create: XOR<LoteCreateInput, LoteUncheckedCreateInput>
    /**
     * In case the Lote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoteUpdateInput, LoteUncheckedUpdateInput>
  }

  /**
   * Lote delete
   */
  export type LoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
    /**
     * Filter which Lote to delete.
     */
    where: LoteWhereUniqueInput
  }

  /**
   * Lote deleteMany
   */
  export type LoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lotes to delete
     */
    where?: LoteWhereInput
  }

  /**
   * Lote.reservaOwner
   */
  export type Lote$reservaOwnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Lote.propostas
   */
  export type Lote$propostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    where?: PropostaWhereInput
    orderBy?: PropostaOrderByWithRelationInput | PropostaOrderByWithRelationInput[]
    cursor?: PropostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropostaScalarFieldEnum | PropostaScalarFieldEnum[]
  }

  /**
   * Lote.auditLogs
   */
  export type Lote$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Lote without action
   */
  export type LoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lote
     */
    select?: LoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoteInclude<ExtArgs> | null
  }


  /**
   * Model Proposta
   */

  export type AggregateProposta = {
    _count: PropostaCountAggregateOutputType | null
    _min: PropostaMinAggregateOutputType | null
    _max: PropostaMaxAggregateOutputType | null
  }

  export type PropostaMinAggregateOutputType = {
    id: string | null
    loteId: string | null
    corretorId: string | null
    nomeCliente: string | null
    telefoneCliente: string | null
    emailCliente: string | null
    payloadFinanceiro: string | null
    status: string | null
    criadaEm: Date | null
  }

  export type PropostaMaxAggregateOutputType = {
    id: string | null
    loteId: string | null
    corretorId: string | null
    nomeCliente: string | null
    telefoneCliente: string | null
    emailCliente: string | null
    payloadFinanceiro: string | null
    status: string | null
    criadaEm: Date | null
  }

  export type PropostaCountAggregateOutputType = {
    id: number
    loteId: number
    corretorId: number
    nomeCliente: number
    telefoneCliente: number
    emailCliente: number
    payloadFinanceiro: number
    status: number
    criadaEm: number
    _all: number
  }


  export type PropostaMinAggregateInputType = {
    id?: true
    loteId?: true
    corretorId?: true
    nomeCliente?: true
    telefoneCliente?: true
    emailCliente?: true
    payloadFinanceiro?: true
    status?: true
    criadaEm?: true
  }

  export type PropostaMaxAggregateInputType = {
    id?: true
    loteId?: true
    corretorId?: true
    nomeCliente?: true
    telefoneCliente?: true
    emailCliente?: true
    payloadFinanceiro?: true
    status?: true
    criadaEm?: true
  }

  export type PropostaCountAggregateInputType = {
    id?: true
    loteId?: true
    corretorId?: true
    nomeCliente?: true
    telefoneCliente?: true
    emailCliente?: true
    payloadFinanceiro?: true
    status?: true
    criadaEm?: true
    _all?: true
  }

  export type PropostaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Proposta to aggregate.
     */
    where?: PropostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Propostas to fetch.
     */
    orderBy?: PropostaOrderByWithRelationInput | PropostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Propostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Propostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Propostas
    **/
    _count?: true | PropostaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropostaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropostaMaxAggregateInputType
  }

  export type GetPropostaAggregateType<T extends PropostaAggregateArgs> = {
        [P in keyof T & keyof AggregateProposta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProposta[P]>
      : GetScalarType<T[P], AggregateProposta[P]>
  }




  export type PropostaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropostaWhereInput
    orderBy?: PropostaOrderByWithAggregationInput | PropostaOrderByWithAggregationInput[]
    by: PropostaScalarFieldEnum[] | PropostaScalarFieldEnum
    having?: PropostaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropostaCountAggregateInputType | true
    _min?: PropostaMinAggregateInputType
    _max?: PropostaMaxAggregateInputType
  }

  export type PropostaGroupByOutputType = {
    id: string
    loteId: string
    corretorId: string
    nomeCliente: string
    telefoneCliente: string | null
    emailCliente: string | null
    payloadFinanceiro: string
    status: string
    criadaEm: Date
    _count: PropostaCountAggregateOutputType | null
    _min: PropostaMinAggregateOutputType | null
    _max: PropostaMaxAggregateOutputType | null
  }

  type GetPropostaGroupByPayload<T extends PropostaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropostaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropostaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropostaGroupByOutputType[P]>
            : GetScalarType<T[P], PropostaGroupByOutputType[P]>
        }
      >
    >


  export type PropostaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loteId?: boolean
    corretorId?: boolean
    nomeCliente?: boolean
    telefoneCliente?: boolean
    emailCliente?: boolean
    payloadFinanceiro?: boolean
    status?: boolean
    criadaEm?: boolean
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    corretor?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proposta"]>

  export type PropostaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loteId?: boolean
    corretorId?: boolean
    nomeCliente?: boolean
    telefoneCliente?: boolean
    emailCliente?: boolean
    payloadFinanceiro?: boolean
    status?: boolean
    criadaEm?: boolean
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    corretor?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["proposta"]>

  export type PropostaSelectScalar = {
    id?: boolean
    loteId?: boolean
    corretorId?: boolean
    nomeCliente?: boolean
    telefoneCliente?: boolean
    emailCliente?: boolean
    payloadFinanceiro?: boolean
    status?: boolean
    criadaEm?: boolean
  }

  export type PropostaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    corretor?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PropostaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    corretor?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PropostaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Proposta"
    objects: {
      lote: Prisma.$LotePayload<ExtArgs>
      corretor: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      loteId: string
      corretorId: string
      nomeCliente: string
      telefoneCliente: string | null
      emailCliente: string | null
      payloadFinanceiro: string
      status: string
      criadaEm: Date
    }, ExtArgs["result"]["proposta"]>
    composites: {}
  }

  type PropostaGetPayload<S extends boolean | null | undefined | PropostaDefaultArgs> = $Result.GetResult<Prisma.$PropostaPayload, S>

  type PropostaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PropostaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PropostaCountAggregateInputType | true
    }

  export interface PropostaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Proposta'], meta: { name: 'Proposta' } }
    /**
     * Find zero or one Proposta that matches the filter.
     * @param {PropostaFindUniqueArgs} args - Arguments to find a Proposta
     * @example
     * // Get one Proposta
     * const proposta = await prisma.proposta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropostaFindUniqueArgs>(args: SelectSubset<T, PropostaFindUniqueArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Proposta that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PropostaFindUniqueOrThrowArgs} args - Arguments to find a Proposta
     * @example
     * // Get one Proposta
     * const proposta = await prisma.proposta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropostaFindUniqueOrThrowArgs>(args: SelectSubset<T, PropostaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Proposta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropostaFindFirstArgs} args - Arguments to find a Proposta
     * @example
     * // Get one Proposta
     * const proposta = await prisma.proposta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropostaFindFirstArgs>(args?: SelectSubset<T, PropostaFindFirstArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Proposta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropostaFindFirstOrThrowArgs} args - Arguments to find a Proposta
     * @example
     * // Get one Proposta
     * const proposta = await prisma.proposta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropostaFindFirstOrThrowArgs>(args?: SelectSubset<T, PropostaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Propostas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropostaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Propostas
     * const propostas = await prisma.proposta.findMany()
     * 
     * // Get first 10 Propostas
     * const propostas = await prisma.proposta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propostaWithIdOnly = await prisma.proposta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropostaFindManyArgs>(args?: SelectSubset<T, PropostaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Proposta.
     * @param {PropostaCreateArgs} args - Arguments to create a Proposta.
     * @example
     * // Create one Proposta
     * const Proposta = await prisma.proposta.create({
     *   data: {
     *     // ... data to create a Proposta
     *   }
     * })
     * 
     */
    create<T extends PropostaCreateArgs>(args: SelectSubset<T, PropostaCreateArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Propostas.
     * @param {PropostaCreateManyArgs} args - Arguments to create many Propostas.
     * @example
     * // Create many Propostas
     * const proposta = await prisma.proposta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropostaCreateManyArgs>(args?: SelectSubset<T, PropostaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Propostas and returns the data saved in the database.
     * @param {PropostaCreateManyAndReturnArgs} args - Arguments to create many Propostas.
     * @example
     * // Create many Propostas
     * const proposta = await prisma.proposta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Propostas and only return the `id`
     * const propostaWithIdOnly = await prisma.proposta.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropostaCreateManyAndReturnArgs>(args?: SelectSubset<T, PropostaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Proposta.
     * @param {PropostaDeleteArgs} args - Arguments to delete one Proposta.
     * @example
     * // Delete one Proposta
     * const Proposta = await prisma.proposta.delete({
     *   where: {
     *     // ... filter to delete one Proposta
     *   }
     * })
     * 
     */
    delete<T extends PropostaDeleteArgs>(args: SelectSubset<T, PropostaDeleteArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Proposta.
     * @param {PropostaUpdateArgs} args - Arguments to update one Proposta.
     * @example
     * // Update one Proposta
     * const proposta = await prisma.proposta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropostaUpdateArgs>(args: SelectSubset<T, PropostaUpdateArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Propostas.
     * @param {PropostaDeleteManyArgs} args - Arguments to filter Propostas to delete.
     * @example
     * // Delete a few Propostas
     * const { count } = await prisma.proposta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropostaDeleteManyArgs>(args?: SelectSubset<T, PropostaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Propostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropostaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Propostas
     * const proposta = await prisma.proposta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropostaUpdateManyArgs>(args: SelectSubset<T, PropostaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Proposta.
     * @param {PropostaUpsertArgs} args - Arguments to update or create a Proposta.
     * @example
     * // Update or create a Proposta
     * const proposta = await prisma.proposta.upsert({
     *   create: {
     *     // ... data to create a Proposta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Proposta we want to update
     *   }
     * })
     */
    upsert<T extends PropostaUpsertArgs>(args: SelectSubset<T, PropostaUpsertArgs<ExtArgs>>): Prisma__PropostaClient<$Result.GetResult<Prisma.$PropostaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Propostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropostaCountArgs} args - Arguments to filter Propostas to count.
     * @example
     * // Count the number of Propostas
     * const count = await prisma.proposta.count({
     *   where: {
     *     // ... the filter for the Propostas we want to count
     *   }
     * })
    **/
    count<T extends PropostaCountArgs>(
      args?: Subset<T, PropostaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropostaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Proposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropostaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropostaAggregateArgs>(args: Subset<T, PropostaAggregateArgs>): Prisma.PrismaPromise<GetPropostaAggregateType<T>>

    /**
     * Group by Proposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropostaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropostaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropostaGroupByArgs['orderBy'] }
        : { orderBy?: PropostaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropostaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropostaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Proposta model
   */
  readonly fields: PropostaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Proposta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropostaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lote<T extends LoteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LoteDefaultArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    corretor<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Proposta model
   */ 
  interface PropostaFieldRefs {
    readonly id: FieldRef<"Proposta", 'String'>
    readonly loteId: FieldRef<"Proposta", 'String'>
    readonly corretorId: FieldRef<"Proposta", 'String'>
    readonly nomeCliente: FieldRef<"Proposta", 'String'>
    readonly telefoneCliente: FieldRef<"Proposta", 'String'>
    readonly emailCliente: FieldRef<"Proposta", 'String'>
    readonly payloadFinanceiro: FieldRef<"Proposta", 'String'>
    readonly status: FieldRef<"Proposta", 'String'>
    readonly criadaEm: FieldRef<"Proposta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Proposta findUnique
   */
  export type PropostaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * Filter, which Proposta to fetch.
     */
    where: PropostaWhereUniqueInput
  }

  /**
   * Proposta findUniqueOrThrow
   */
  export type PropostaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * Filter, which Proposta to fetch.
     */
    where: PropostaWhereUniqueInput
  }

  /**
   * Proposta findFirst
   */
  export type PropostaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * Filter, which Proposta to fetch.
     */
    where?: PropostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Propostas to fetch.
     */
    orderBy?: PropostaOrderByWithRelationInput | PropostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Propostas.
     */
    cursor?: PropostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Propostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Propostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Propostas.
     */
    distinct?: PropostaScalarFieldEnum | PropostaScalarFieldEnum[]
  }

  /**
   * Proposta findFirstOrThrow
   */
  export type PropostaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * Filter, which Proposta to fetch.
     */
    where?: PropostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Propostas to fetch.
     */
    orderBy?: PropostaOrderByWithRelationInput | PropostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Propostas.
     */
    cursor?: PropostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Propostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Propostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Propostas.
     */
    distinct?: PropostaScalarFieldEnum | PropostaScalarFieldEnum[]
  }

  /**
   * Proposta findMany
   */
  export type PropostaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * Filter, which Propostas to fetch.
     */
    where?: PropostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Propostas to fetch.
     */
    orderBy?: PropostaOrderByWithRelationInput | PropostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Propostas.
     */
    cursor?: PropostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Propostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Propostas.
     */
    skip?: number
    distinct?: PropostaScalarFieldEnum | PropostaScalarFieldEnum[]
  }

  /**
   * Proposta create
   */
  export type PropostaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * The data needed to create a Proposta.
     */
    data: XOR<PropostaCreateInput, PropostaUncheckedCreateInput>
  }

  /**
   * Proposta createMany
   */
  export type PropostaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Propostas.
     */
    data: PropostaCreateManyInput | PropostaCreateManyInput[]
  }

  /**
   * Proposta createManyAndReturn
   */
  export type PropostaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Propostas.
     */
    data: PropostaCreateManyInput | PropostaCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Proposta update
   */
  export type PropostaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * The data needed to update a Proposta.
     */
    data: XOR<PropostaUpdateInput, PropostaUncheckedUpdateInput>
    /**
     * Choose, which Proposta to update.
     */
    where: PropostaWhereUniqueInput
  }

  /**
   * Proposta updateMany
   */
  export type PropostaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Propostas.
     */
    data: XOR<PropostaUpdateManyMutationInput, PropostaUncheckedUpdateManyInput>
    /**
     * Filter which Propostas to update
     */
    where?: PropostaWhereInput
  }

  /**
   * Proposta upsert
   */
  export type PropostaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * The filter to search for the Proposta to update in case it exists.
     */
    where: PropostaWhereUniqueInput
    /**
     * In case the Proposta found by the `where` argument doesn't exist, create a new Proposta with this data.
     */
    create: XOR<PropostaCreateInput, PropostaUncheckedCreateInput>
    /**
     * In case the Proposta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropostaUpdateInput, PropostaUncheckedUpdateInput>
  }

  /**
   * Proposta delete
   */
  export type PropostaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
    /**
     * Filter which Proposta to delete.
     */
    where: PropostaWhereUniqueInput
  }

  /**
   * Proposta deleteMany
   */
  export type PropostaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Propostas to delete
     */
    where?: PropostaWhereInput
  }

  /**
   * Proposta without action
   */
  export type PropostaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Proposta
     */
    select?: PropostaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropostaInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    loteId: string | null
    userId: string | null
    evento: string | null
    payloadAnterior: string | null
    payloadNovo: string | null
    criadoEm: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    loteId: string | null
    userId: string | null
    evento: string | null
    payloadAnterior: string | null
    payloadNovo: string | null
    criadoEm: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    loteId: number
    userId: number
    evento: number
    payloadAnterior: number
    payloadNovo: number
    criadoEm: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    loteId?: true
    userId?: true
    evento?: true
    payloadAnterior?: true
    payloadNovo?: true
    criadoEm?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    loteId?: true
    userId?: true
    evento?: true
    payloadAnterior?: true
    payloadNovo?: true
    criadoEm?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    loteId?: true
    userId?: true
    evento?: true
    payloadAnterior?: true
    payloadNovo?: true
    criadoEm?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    loteId: string
    userId: string | null
    evento: string
    payloadAnterior: string | null
    payloadNovo: string | null
    criadoEm: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loteId?: boolean
    userId?: boolean
    evento?: boolean
    payloadAnterior?: boolean
    payloadNovo?: boolean
    criadoEm?: boolean
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loteId?: boolean
    userId?: boolean
    evento?: boolean
    payloadAnterior?: boolean
    payloadNovo?: boolean
    criadoEm?: boolean
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    loteId?: boolean
    userId?: boolean
    evento?: boolean
    payloadAnterior?: boolean
    payloadNovo?: boolean
    criadoEm?: boolean
  }

  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lote?: boolean | LoteDefaultArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      lote: Prisma.$LotePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      loteId: string
      userId: string | null
      evento: string
      payloadAnterior: string | null
      payloadNovo: string | null
      criadoEm: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lote<T extends LoteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LoteDefaultArgs<ExtArgs>>): Prisma__LoteClient<$Result.GetResult<Prisma.$LotePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */ 
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly loteId: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly evento: FieldRef<"AuditLog", 'String'>
    readonly payloadAnterior: FieldRef<"AuditLog", 'String'>
    readonly payloadNovo: FieldRef<"AuditLog", 'String'>
    readonly criadoEm: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    login: 'login',
    senhaHash: 'senhaHash',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const LoteScalarFieldEnum: {
    id: 'id',
    n: 'n',
    q: 'q',
    area: 'area',
    valor: 'valor',
    status: 'status',
    reservaVenceEm: 'reservaVenceEm',
    comprador: 'comprador',
    compradorAnterior: 'compradorAnterior',
    reservaOwnerId: 'reservaOwnerId'
  };

  export type LoteScalarFieldEnum = (typeof LoteScalarFieldEnum)[keyof typeof LoteScalarFieldEnum]


  export const PropostaScalarFieldEnum: {
    id: 'id',
    loteId: 'loteId',
    corretorId: 'corretorId',
    nomeCliente: 'nomeCliente',
    telefoneCliente: 'telefoneCliente',
    emailCliente: 'emailCliente',
    payloadFinanceiro: 'payloadFinanceiro',
    status: 'status',
    criadaEm: 'criadaEm'
  };

  export type PropostaScalarFieldEnum = (typeof PropostaScalarFieldEnum)[keyof typeof PropostaScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    loteId: 'loteId',
    userId: 'userId',
    evento: 'evento',
    payloadAnterior: 'payloadAnterior',
    payloadNovo: 'payloadNovo',
    criadoEm: 'criadoEm'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    nome?: StringFilter<"User"> | string
    login?: StringFilter<"User"> | string
    senhaHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    lotes?: LoteListRelationFilter
    propostas?: PropostaListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    login?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    lotes?: LoteOrderByRelationAggregateInput
    propostas?: PropostaOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    login?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    nome?: StringFilter<"User"> | string
    senhaHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    lotes?: LoteListRelationFilter
    propostas?: PropostaListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "login">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    login?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    nome?: StringWithAggregatesFilter<"User"> | string
    login?: StringWithAggregatesFilter<"User"> | string
    senhaHash?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type LoteWhereInput = {
    AND?: LoteWhereInput | LoteWhereInput[]
    OR?: LoteWhereInput[]
    NOT?: LoteWhereInput | LoteWhereInput[]
    id?: StringFilter<"Lote"> | string
    n?: StringFilter<"Lote"> | string
    q?: StringFilter<"Lote"> | string
    area?: FloatFilter<"Lote"> | number
    valor?: FloatFilter<"Lote"> | number
    status?: StringFilter<"Lote"> | string
    reservaVenceEm?: DateTimeNullableFilter<"Lote"> | Date | string | null
    comprador?: StringNullableFilter<"Lote"> | string | null
    compradorAnterior?: StringNullableFilter<"Lote"> | string | null
    reservaOwnerId?: StringNullableFilter<"Lote"> | string | null
    reservaOwner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    propostas?: PropostaListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type LoteOrderByWithRelationInput = {
    id?: SortOrder
    n?: SortOrder
    q?: SortOrder
    area?: SortOrder
    valor?: SortOrder
    status?: SortOrder
    reservaVenceEm?: SortOrderInput | SortOrder
    comprador?: SortOrderInput | SortOrder
    compradorAnterior?: SortOrderInput | SortOrder
    reservaOwnerId?: SortOrderInput | SortOrder
    reservaOwner?: UserOrderByWithRelationInput
    propostas?: PropostaOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type LoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LoteWhereInput | LoteWhereInput[]
    OR?: LoteWhereInput[]
    NOT?: LoteWhereInput | LoteWhereInput[]
    n?: StringFilter<"Lote"> | string
    q?: StringFilter<"Lote"> | string
    area?: FloatFilter<"Lote"> | number
    valor?: FloatFilter<"Lote"> | number
    status?: StringFilter<"Lote"> | string
    reservaVenceEm?: DateTimeNullableFilter<"Lote"> | Date | string | null
    comprador?: StringNullableFilter<"Lote"> | string | null
    compradorAnterior?: StringNullableFilter<"Lote"> | string | null
    reservaOwnerId?: StringNullableFilter<"Lote"> | string | null
    reservaOwner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    propostas?: PropostaListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id">

  export type LoteOrderByWithAggregationInput = {
    id?: SortOrder
    n?: SortOrder
    q?: SortOrder
    area?: SortOrder
    valor?: SortOrder
    status?: SortOrder
    reservaVenceEm?: SortOrderInput | SortOrder
    comprador?: SortOrderInput | SortOrder
    compradorAnterior?: SortOrderInput | SortOrder
    reservaOwnerId?: SortOrderInput | SortOrder
    _count?: LoteCountOrderByAggregateInput
    _avg?: LoteAvgOrderByAggregateInput
    _max?: LoteMaxOrderByAggregateInput
    _min?: LoteMinOrderByAggregateInput
    _sum?: LoteSumOrderByAggregateInput
  }

  export type LoteScalarWhereWithAggregatesInput = {
    AND?: LoteScalarWhereWithAggregatesInput | LoteScalarWhereWithAggregatesInput[]
    OR?: LoteScalarWhereWithAggregatesInput[]
    NOT?: LoteScalarWhereWithAggregatesInput | LoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lote"> | string
    n?: StringWithAggregatesFilter<"Lote"> | string
    q?: StringWithAggregatesFilter<"Lote"> | string
    area?: FloatWithAggregatesFilter<"Lote"> | number
    valor?: FloatWithAggregatesFilter<"Lote"> | number
    status?: StringWithAggregatesFilter<"Lote"> | string
    reservaVenceEm?: DateTimeNullableWithAggregatesFilter<"Lote"> | Date | string | null
    comprador?: StringNullableWithAggregatesFilter<"Lote"> | string | null
    compradorAnterior?: StringNullableWithAggregatesFilter<"Lote"> | string | null
    reservaOwnerId?: StringNullableWithAggregatesFilter<"Lote"> | string | null
  }

  export type PropostaWhereInput = {
    AND?: PropostaWhereInput | PropostaWhereInput[]
    OR?: PropostaWhereInput[]
    NOT?: PropostaWhereInput | PropostaWhereInput[]
    id?: StringFilter<"Proposta"> | string
    loteId?: StringFilter<"Proposta"> | string
    corretorId?: StringFilter<"Proposta"> | string
    nomeCliente?: StringFilter<"Proposta"> | string
    telefoneCliente?: StringNullableFilter<"Proposta"> | string | null
    emailCliente?: StringNullableFilter<"Proposta"> | string | null
    payloadFinanceiro?: StringFilter<"Proposta"> | string
    status?: StringFilter<"Proposta"> | string
    criadaEm?: DateTimeFilter<"Proposta"> | Date | string
    lote?: XOR<LoteScalarRelationFilter, LoteWhereInput>
    corretor?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PropostaOrderByWithRelationInput = {
    id?: SortOrder
    loteId?: SortOrder
    corretorId?: SortOrder
    nomeCliente?: SortOrder
    telefoneCliente?: SortOrderInput | SortOrder
    emailCliente?: SortOrderInput | SortOrder
    payloadFinanceiro?: SortOrder
    status?: SortOrder
    criadaEm?: SortOrder
    lote?: LoteOrderByWithRelationInput
    corretor?: UserOrderByWithRelationInput
  }

  export type PropostaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PropostaWhereInput | PropostaWhereInput[]
    OR?: PropostaWhereInput[]
    NOT?: PropostaWhereInput | PropostaWhereInput[]
    loteId?: StringFilter<"Proposta"> | string
    corretorId?: StringFilter<"Proposta"> | string
    nomeCliente?: StringFilter<"Proposta"> | string
    telefoneCliente?: StringNullableFilter<"Proposta"> | string | null
    emailCliente?: StringNullableFilter<"Proposta"> | string | null
    payloadFinanceiro?: StringFilter<"Proposta"> | string
    status?: StringFilter<"Proposta"> | string
    criadaEm?: DateTimeFilter<"Proposta"> | Date | string
    lote?: XOR<LoteScalarRelationFilter, LoteWhereInput>
    corretor?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PropostaOrderByWithAggregationInput = {
    id?: SortOrder
    loteId?: SortOrder
    corretorId?: SortOrder
    nomeCliente?: SortOrder
    telefoneCliente?: SortOrderInput | SortOrder
    emailCliente?: SortOrderInput | SortOrder
    payloadFinanceiro?: SortOrder
    status?: SortOrder
    criadaEm?: SortOrder
    _count?: PropostaCountOrderByAggregateInput
    _max?: PropostaMaxOrderByAggregateInput
    _min?: PropostaMinOrderByAggregateInput
  }

  export type PropostaScalarWhereWithAggregatesInput = {
    AND?: PropostaScalarWhereWithAggregatesInput | PropostaScalarWhereWithAggregatesInput[]
    OR?: PropostaScalarWhereWithAggregatesInput[]
    NOT?: PropostaScalarWhereWithAggregatesInput | PropostaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Proposta"> | string
    loteId?: StringWithAggregatesFilter<"Proposta"> | string
    corretorId?: StringWithAggregatesFilter<"Proposta"> | string
    nomeCliente?: StringWithAggregatesFilter<"Proposta"> | string
    telefoneCliente?: StringNullableWithAggregatesFilter<"Proposta"> | string | null
    emailCliente?: StringNullableWithAggregatesFilter<"Proposta"> | string | null
    payloadFinanceiro?: StringWithAggregatesFilter<"Proposta"> | string
    status?: StringWithAggregatesFilter<"Proposta"> | string
    criadaEm?: DateTimeWithAggregatesFilter<"Proposta"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    loteId?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    evento?: StringFilter<"AuditLog"> | string
    payloadAnterior?: StringNullableFilter<"AuditLog"> | string | null
    payloadNovo?: StringNullableFilter<"AuditLog"> | string | null
    criadoEm?: DateTimeFilter<"AuditLog"> | Date | string
    lote?: XOR<LoteScalarRelationFilter, LoteWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    loteId?: SortOrder
    userId?: SortOrderInput | SortOrder
    evento?: SortOrder
    payloadAnterior?: SortOrderInput | SortOrder
    payloadNovo?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    lote?: LoteOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    loteId?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    evento?: StringFilter<"AuditLog"> | string
    payloadAnterior?: StringNullableFilter<"AuditLog"> | string | null
    payloadNovo?: StringNullableFilter<"AuditLog"> | string | null
    criadoEm?: DateTimeFilter<"AuditLog"> | Date | string
    lote?: XOR<LoteScalarRelationFilter, LoteWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    loteId?: SortOrder
    userId?: SortOrderInput | SortOrder
    evento?: SortOrder
    payloadAnterior?: SortOrderInput | SortOrder
    payloadNovo?: SortOrderInput | SortOrder
    criadoEm?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    loteId?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    evento?: StringWithAggregatesFilter<"AuditLog"> | string
    payloadAnterior?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    payloadNovo?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    criadoEm?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    lotes?: LoteCreateNestedManyWithoutReservaOwnerInput
    propostas?: PropostaCreateNestedManyWithoutCorretorInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    lotes?: LoteUncheckedCreateNestedManyWithoutReservaOwnerInput
    propostas?: PropostaUncheckedCreateNestedManyWithoutCorretorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lotes?: LoteUpdateManyWithoutReservaOwnerNestedInput
    propostas?: PropostaUpdateManyWithoutCorretorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lotes?: LoteUncheckedUpdateManyWithoutReservaOwnerNestedInput
    propostas?: PropostaUncheckedUpdateManyWithoutCorretorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoteCreateInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    reservaOwner?: UserCreateNestedOneWithoutLotesInput
    propostas?: PropostaCreateNestedManyWithoutLoteInput
    auditLogs?: AuditLogCreateNestedManyWithoutLoteInput
  }

  export type LoteUncheckedCreateInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    reservaOwnerId?: string | null
    propostas?: PropostaUncheckedCreateNestedManyWithoutLoteInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutLoteInput
  }

  export type LoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    reservaOwner?: UserUpdateOneWithoutLotesNestedInput
    propostas?: PropostaUpdateManyWithoutLoteNestedInput
    auditLogs?: AuditLogUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    reservaOwnerId?: NullableStringFieldUpdateOperationsInput | string | null
    propostas?: PropostaUncheckedUpdateManyWithoutLoteNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutLoteNestedInput
  }

  export type LoteCreateManyInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    reservaOwnerId?: string | null
  }

  export type LoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    reservaOwnerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropostaCreateInput = {
    id?: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
    lote: LoteCreateNestedOneWithoutPropostasInput
    corretor: UserCreateNestedOneWithoutPropostasInput
  }

  export type PropostaUncheckedCreateInput = {
    id?: string
    loteId: string
    corretorId: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
  }

  export type PropostaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lote?: LoteUpdateOneRequiredWithoutPropostasNestedInput
    corretor?: UserUpdateOneRequiredWithoutPropostasNestedInput
  }

  export type PropostaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    corretorId?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropostaCreateManyInput = {
    id?: string
    loteId: string
    corretorId: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
  }

  export type PropostaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropostaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    corretorId?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
    lote: LoteCreateNestedOneWithoutAuditLogsInput
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    loteId: string
    userId?: string | null
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lote?: LoteUpdateOneRequiredWithoutAuditLogsNestedInput
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    loteId: string
    userId?: string | null
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LoteListRelationFilter = {
    every?: LoteWhereInput
    some?: LoteWhereInput
    none?: LoteWhereInput
  }

  export type PropostaListRelationFilter = {
    every?: PropostaWhereInput
    some?: PropostaWhereInput
    none?: PropostaWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type LoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PropostaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    login?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    login?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    login?: SortOrder
    senhaHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LoteCountOrderByAggregateInput = {
    id?: SortOrder
    n?: SortOrder
    q?: SortOrder
    area?: SortOrder
    valor?: SortOrder
    status?: SortOrder
    reservaVenceEm?: SortOrder
    comprador?: SortOrder
    compradorAnterior?: SortOrder
    reservaOwnerId?: SortOrder
  }

  export type LoteAvgOrderByAggregateInput = {
    area?: SortOrder
    valor?: SortOrder
  }

  export type LoteMaxOrderByAggregateInput = {
    id?: SortOrder
    n?: SortOrder
    q?: SortOrder
    area?: SortOrder
    valor?: SortOrder
    status?: SortOrder
    reservaVenceEm?: SortOrder
    comprador?: SortOrder
    compradorAnterior?: SortOrder
    reservaOwnerId?: SortOrder
  }

  export type LoteMinOrderByAggregateInput = {
    id?: SortOrder
    n?: SortOrder
    q?: SortOrder
    area?: SortOrder
    valor?: SortOrder
    status?: SortOrder
    reservaVenceEm?: SortOrder
    comprador?: SortOrder
    compradorAnterior?: SortOrder
    reservaOwnerId?: SortOrder
  }

  export type LoteSumOrderByAggregateInput = {
    area?: SortOrder
    valor?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type LoteScalarRelationFilter = {
    is?: LoteWhereInput
    isNot?: LoteWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PropostaCountOrderByAggregateInput = {
    id?: SortOrder
    loteId?: SortOrder
    corretorId?: SortOrder
    nomeCliente?: SortOrder
    telefoneCliente?: SortOrder
    emailCliente?: SortOrder
    payloadFinanceiro?: SortOrder
    status?: SortOrder
    criadaEm?: SortOrder
  }

  export type PropostaMaxOrderByAggregateInput = {
    id?: SortOrder
    loteId?: SortOrder
    corretorId?: SortOrder
    nomeCliente?: SortOrder
    telefoneCliente?: SortOrder
    emailCliente?: SortOrder
    payloadFinanceiro?: SortOrder
    status?: SortOrder
    criadaEm?: SortOrder
  }

  export type PropostaMinOrderByAggregateInput = {
    id?: SortOrder
    loteId?: SortOrder
    corretorId?: SortOrder
    nomeCliente?: SortOrder
    telefoneCliente?: SortOrder
    emailCliente?: SortOrder
    payloadFinanceiro?: SortOrder
    status?: SortOrder
    criadaEm?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    loteId?: SortOrder
    userId?: SortOrder
    evento?: SortOrder
    payloadAnterior?: SortOrder
    payloadNovo?: SortOrder
    criadoEm?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    loteId?: SortOrder
    userId?: SortOrder
    evento?: SortOrder
    payloadAnterior?: SortOrder
    payloadNovo?: SortOrder
    criadoEm?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    loteId?: SortOrder
    userId?: SortOrder
    evento?: SortOrder
    payloadAnterior?: SortOrder
    payloadNovo?: SortOrder
    criadoEm?: SortOrder
  }

  export type LoteCreateNestedManyWithoutReservaOwnerInput = {
    create?: XOR<LoteCreateWithoutReservaOwnerInput, LoteUncheckedCreateWithoutReservaOwnerInput> | LoteCreateWithoutReservaOwnerInput[] | LoteUncheckedCreateWithoutReservaOwnerInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutReservaOwnerInput | LoteCreateOrConnectWithoutReservaOwnerInput[]
    createMany?: LoteCreateManyReservaOwnerInputEnvelope
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
  }

  export type PropostaCreateNestedManyWithoutCorretorInput = {
    create?: XOR<PropostaCreateWithoutCorretorInput, PropostaUncheckedCreateWithoutCorretorInput> | PropostaCreateWithoutCorretorInput[] | PropostaUncheckedCreateWithoutCorretorInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutCorretorInput | PropostaCreateOrConnectWithoutCorretorInput[]
    createMany?: PropostaCreateManyCorretorInputEnvelope
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type LoteUncheckedCreateNestedManyWithoutReservaOwnerInput = {
    create?: XOR<LoteCreateWithoutReservaOwnerInput, LoteUncheckedCreateWithoutReservaOwnerInput> | LoteCreateWithoutReservaOwnerInput[] | LoteUncheckedCreateWithoutReservaOwnerInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutReservaOwnerInput | LoteCreateOrConnectWithoutReservaOwnerInput[]
    createMany?: LoteCreateManyReservaOwnerInputEnvelope
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
  }

  export type PropostaUncheckedCreateNestedManyWithoutCorretorInput = {
    create?: XOR<PropostaCreateWithoutCorretorInput, PropostaUncheckedCreateWithoutCorretorInput> | PropostaCreateWithoutCorretorInput[] | PropostaUncheckedCreateWithoutCorretorInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutCorretorInput | PropostaCreateOrConnectWithoutCorretorInput[]
    createMany?: PropostaCreateManyCorretorInputEnvelope
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LoteUpdateManyWithoutReservaOwnerNestedInput = {
    create?: XOR<LoteCreateWithoutReservaOwnerInput, LoteUncheckedCreateWithoutReservaOwnerInput> | LoteCreateWithoutReservaOwnerInput[] | LoteUncheckedCreateWithoutReservaOwnerInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutReservaOwnerInput | LoteCreateOrConnectWithoutReservaOwnerInput[]
    upsert?: LoteUpsertWithWhereUniqueWithoutReservaOwnerInput | LoteUpsertWithWhereUniqueWithoutReservaOwnerInput[]
    createMany?: LoteCreateManyReservaOwnerInputEnvelope
    set?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    disconnect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    delete?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    update?: LoteUpdateWithWhereUniqueWithoutReservaOwnerInput | LoteUpdateWithWhereUniqueWithoutReservaOwnerInput[]
    updateMany?: LoteUpdateManyWithWhereWithoutReservaOwnerInput | LoteUpdateManyWithWhereWithoutReservaOwnerInput[]
    deleteMany?: LoteScalarWhereInput | LoteScalarWhereInput[]
  }

  export type PropostaUpdateManyWithoutCorretorNestedInput = {
    create?: XOR<PropostaCreateWithoutCorretorInput, PropostaUncheckedCreateWithoutCorretorInput> | PropostaCreateWithoutCorretorInput[] | PropostaUncheckedCreateWithoutCorretorInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutCorretorInput | PropostaCreateOrConnectWithoutCorretorInput[]
    upsert?: PropostaUpsertWithWhereUniqueWithoutCorretorInput | PropostaUpsertWithWhereUniqueWithoutCorretorInput[]
    createMany?: PropostaCreateManyCorretorInputEnvelope
    set?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    disconnect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    delete?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    update?: PropostaUpdateWithWhereUniqueWithoutCorretorInput | PropostaUpdateWithWhereUniqueWithoutCorretorInput[]
    updateMany?: PropostaUpdateManyWithWhereWithoutCorretorInput | PropostaUpdateManyWithWhereWithoutCorretorInput[]
    deleteMany?: PropostaScalarWhereInput | PropostaScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type LoteUncheckedUpdateManyWithoutReservaOwnerNestedInput = {
    create?: XOR<LoteCreateWithoutReservaOwnerInput, LoteUncheckedCreateWithoutReservaOwnerInput> | LoteCreateWithoutReservaOwnerInput[] | LoteUncheckedCreateWithoutReservaOwnerInput[]
    connectOrCreate?: LoteCreateOrConnectWithoutReservaOwnerInput | LoteCreateOrConnectWithoutReservaOwnerInput[]
    upsert?: LoteUpsertWithWhereUniqueWithoutReservaOwnerInput | LoteUpsertWithWhereUniqueWithoutReservaOwnerInput[]
    createMany?: LoteCreateManyReservaOwnerInputEnvelope
    set?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    disconnect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    delete?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    connect?: LoteWhereUniqueInput | LoteWhereUniqueInput[]
    update?: LoteUpdateWithWhereUniqueWithoutReservaOwnerInput | LoteUpdateWithWhereUniqueWithoutReservaOwnerInput[]
    updateMany?: LoteUpdateManyWithWhereWithoutReservaOwnerInput | LoteUpdateManyWithWhereWithoutReservaOwnerInput[]
    deleteMany?: LoteScalarWhereInput | LoteScalarWhereInput[]
  }

  export type PropostaUncheckedUpdateManyWithoutCorretorNestedInput = {
    create?: XOR<PropostaCreateWithoutCorretorInput, PropostaUncheckedCreateWithoutCorretorInput> | PropostaCreateWithoutCorretorInput[] | PropostaUncheckedCreateWithoutCorretorInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutCorretorInput | PropostaCreateOrConnectWithoutCorretorInput[]
    upsert?: PropostaUpsertWithWhereUniqueWithoutCorretorInput | PropostaUpsertWithWhereUniqueWithoutCorretorInput[]
    createMany?: PropostaCreateManyCorretorInputEnvelope
    set?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    disconnect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    delete?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    update?: PropostaUpdateWithWhereUniqueWithoutCorretorInput | PropostaUpdateWithWhereUniqueWithoutCorretorInput[]
    updateMany?: PropostaUpdateManyWithWhereWithoutCorretorInput | PropostaUpdateManyWithWhereWithoutCorretorInput[]
    deleteMany?: PropostaScalarWhereInput | PropostaScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLotesInput = {
    create?: XOR<UserCreateWithoutLotesInput, UserUncheckedCreateWithoutLotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLotesInput
    connect?: UserWhereUniqueInput
  }

  export type PropostaCreateNestedManyWithoutLoteInput = {
    create?: XOR<PropostaCreateWithoutLoteInput, PropostaUncheckedCreateWithoutLoteInput> | PropostaCreateWithoutLoteInput[] | PropostaUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutLoteInput | PropostaCreateOrConnectWithoutLoteInput[]
    createMany?: PropostaCreateManyLoteInputEnvelope
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutLoteInput = {
    create?: XOR<AuditLogCreateWithoutLoteInput, AuditLogUncheckedCreateWithoutLoteInput> | AuditLogCreateWithoutLoteInput[] | AuditLogUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutLoteInput | AuditLogCreateOrConnectWithoutLoteInput[]
    createMany?: AuditLogCreateManyLoteInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type PropostaUncheckedCreateNestedManyWithoutLoteInput = {
    create?: XOR<PropostaCreateWithoutLoteInput, PropostaUncheckedCreateWithoutLoteInput> | PropostaCreateWithoutLoteInput[] | PropostaUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutLoteInput | PropostaCreateOrConnectWithoutLoteInput[]
    createMany?: PropostaCreateManyLoteInputEnvelope
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutLoteInput = {
    create?: XOR<AuditLogCreateWithoutLoteInput, AuditLogUncheckedCreateWithoutLoteInput> | AuditLogCreateWithoutLoteInput[] | AuditLogUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutLoteInput | AuditLogCreateOrConnectWithoutLoteInput[]
    createMany?: AuditLogCreateManyLoteInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneWithoutLotesNestedInput = {
    create?: XOR<UserCreateWithoutLotesInput, UserUncheckedCreateWithoutLotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLotesInput
    upsert?: UserUpsertWithoutLotesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLotesInput, UserUpdateWithoutLotesInput>, UserUncheckedUpdateWithoutLotesInput>
  }

  export type PropostaUpdateManyWithoutLoteNestedInput = {
    create?: XOR<PropostaCreateWithoutLoteInput, PropostaUncheckedCreateWithoutLoteInput> | PropostaCreateWithoutLoteInput[] | PropostaUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutLoteInput | PropostaCreateOrConnectWithoutLoteInput[]
    upsert?: PropostaUpsertWithWhereUniqueWithoutLoteInput | PropostaUpsertWithWhereUniqueWithoutLoteInput[]
    createMany?: PropostaCreateManyLoteInputEnvelope
    set?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    disconnect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    delete?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    update?: PropostaUpdateWithWhereUniqueWithoutLoteInput | PropostaUpdateWithWhereUniqueWithoutLoteInput[]
    updateMany?: PropostaUpdateManyWithWhereWithoutLoteInput | PropostaUpdateManyWithWhereWithoutLoteInput[]
    deleteMany?: PropostaScalarWhereInput | PropostaScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutLoteNestedInput = {
    create?: XOR<AuditLogCreateWithoutLoteInput, AuditLogUncheckedCreateWithoutLoteInput> | AuditLogCreateWithoutLoteInput[] | AuditLogUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutLoteInput | AuditLogCreateOrConnectWithoutLoteInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutLoteInput | AuditLogUpsertWithWhereUniqueWithoutLoteInput[]
    createMany?: AuditLogCreateManyLoteInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutLoteInput | AuditLogUpdateWithWhereUniqueWithoutLoteInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutLoteInput | AuditLogUpdateManyWithWhereWithoutLoteInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type PropostaUncheckedUpdateManyWithoutLoteNestedInput = {
    create?: XOR<PropostaCreateWithoutLoteInput, PropostaUncheckedCreateWithoutLoteInput> | PropostaCreateWithoutLoteInput[] | PropostaUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: PropostaCreateOrConnectWithoutLoteInput | PropostaCreateOrConnectWithoutLoteInput[]
    upsert?: PropostaUpsertWithWhereUniqueWithoutLoteInput | PropostaUpsertWithWhereUniqueWithoutLoteInput[]
    createMany?: PropostaCreateManyLoteInputEnvelope
    set?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    disconnect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    delete?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    connect?: PropostaWhereUniqueInput | PropostaWhereUniqueInput[]
    update?: PropostaUpdateWithWhereUniqueWithoutLoteInput | PropostaUpdateWithWhereUniqueWithoutLoteInput[]
    updateMany?: PropostaUpdateManyWithWhereWithoutLoteInput | PropostaUpdateManyWithWhereWithoutLoteInput[]
    deleteMany?: PropostaScalarWhereInput | PropostaScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutLoteNestedInput = {
    create?: XOR<AuditLogCreateWithoutLoteInput, AuditLogUncheckedCreateWithoutLoteInput> | AuditLogCreateWithoutLoteInput[] | AuditLogUncheckedCreateWithoutLoteInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutLoteInput | AuditLogCreateOrConnectWithoutLoteInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutLoteInput | AuditLogUpsertWithWhereUniqueWithoutLoteInput[]
    createMany?: AuditLogCreateManyLoteInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutLoteInput | AuditLogUpdateWithWhereUniqueWithoutLoteInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutLoteInput | AuditLogUpdateManyWithWhereWithoutLoteInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type LoteCreateNestedOneWithoutPropostasInput = {
    create?: XOR<LoteCreateWithoutPropostasInput, LoteUncheckedCreateWithoutPropostasInput>
    connectOrCreate?: LoteCreateOrConnectWithoutPropostasInput
    connect?: LoteWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPropostasInput = {
    create?: XOR<UserCreateWithoutPropostasInput, UserUncheckedCreateWithoutPropostasInput>
    connectOrCreate?: UserCreateOrConnectWithoutPropostasInput
    connect?: UserWhereUniqueInput
  }

  export type LoteUpdateOneRequiredWithoutPropostasNestedInput = {
    create?: XOR<LoteCreateWithoutPropostasInput, LoteUncheckedCreateWithoutPropostasInput>
    connectOrCreate?: LoteCreateOrConnectWithoutPropostasInput
    upsert?: LoteUpsertWithoutPropostasInput
    connect?: LoteWhereUniqueInput
    update?: XOR<XOR<LoteUpdateToOneWithWhereWithoutPropostasInput, LoteUpdateWithoutPropostasInput>, LoteUncheckedUpdateWithoutPropostasInput>
  }

  export type UserUpdateOneRequiredWithoutPropostasNestedInput = {
    create?: XOR<UserCreateWithoutPropostasInput, UserUncheckedCreateWithoutPropostasInput>
    connectOrCreate?: UserCreateOrConnectWithoutPropostasInput
    upsert?: UserUpsertWithoutPropostasInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPropostasInput, UserUpdateWithoutPropostasInput>, UserUncheckedUpdateWithoutPropostasInput>
  }

  export type LoteCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<LoteCreateWithoutAuditLogsInput, LoteUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: LoteCreateOrConnectWithoutAuditLogsInput
    connect?: LoteWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type LoteUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<LoteCreateWithoutAuditLogsInput, LoteUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: LoteCreateOrConnectWithoutAuditLogsInput
    upsert?: LoteUpsertWithoutAuditLogsInput
    connect?: LoteWhereUniqueInput
    update?: XOR<XOR<LoteUpdateToOneWithWhereWithoutAuditLogsInput, LoteUpdateWithoutAuditLogsInput>, LoteUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type LoteCreateWithoutReservaOwnerInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    propostas?: PropostaCreateNestedManyWithoutLoteInput
    auditLogs?: AuditLogCreateNestedManyWithoutLoteInput
  }

  export type LoteUncheckedCreateWithoutReservaOwnerInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    propostas?: PropostaUncheckedCreateNestedManyWithoutLoteInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutLoteInput
  }

  export type LoteCreateOrConnectWithoutReservaOwnerInput = {
    where: LoteWhereUniqueInput
    create: XOR<LoteCreateWithoutReservaOwnerInput, LoteUncheckedCreateWithoutReservaOwnerInput>
  }

  export type LoteCreateManyReservaOwnerInputEnvelope = {
    data: LoteCreateManyReservaOwnerInput | LoteCreateManyReservaOwnerInput[]
  }

  export type PropostaCreateWithoutCorretorInput = {
    id?: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
    lote: LoteCreateNestedOneWithoutPropostasInput
  }

  export type PropostaUncheckedCreateWithoutCorretorInput = {
    id?: string
    loteId: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
  }

  export type PropostaCreateOrConnectWithoutCorretorInput = {
    where: PropostaWhereUniqueInput
    create: XOR<PropostaCreateWithoutCorretorInput, PropostaUncheckedCreateWithoutCorretorInput>
  }

  export type PropostaCreateManyCorretorInputEnvelope = {
    data: PropostaCreateManyCorretorInput | PropostaCreateManyCorretorInput[]
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
    lote: LoteCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    loteId: string
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
  }

  export type LoteUpsertWithWhereUniqueWithoutReservaOwnerInput = {
    where: LoteWhereUniqueInput
    update: XOR<LoteUpdateWithoutReservaOwnerInput, LoteUncheckedUpdateWithoutReservaOwnerInput>
    create: XOR<LoteCreateWithoutReservaOwnerInput, LoteUncheckedCreateWithoutReservaOwnerInput>
  }

  export type LoteUpdateWithWhereUniqueWithoutReservaOwnerInput = {
    where: LoteWhereUniqueInput
    data: XOR<LoteUpdateWithoutReservaOwnerInput, LoteUncheckedUpdateWithoutReservaOwnerInput>
  }

  export type LoteUpdateManyWithWhereWithoutReservaOwnerInput = {
    where: LoteScalarWhereInput
    data: XOR<LoteUpdateManyMutationInput, LoteUncheckedUpdateManyWithoutReservaOwnerInput>
  }

  export type LoteScalarWhereInput = {
    AND?: LoteScalarWhereInput | LoteScalarWhereInput[]
    OR?: LoteScalarWhereInput[]
    NOT?: LoteScalarWhereInput | LoteScalarWhereInput[]
    id?: StringFilter<"Lote"> | string
    n?: StringFilter<"Lote"> | string
    q?: StringFilter<"Lote"> | string
    area?: FloatFilter<"Lote"> | number
    valor?: FloatFilter<"Lote"> | number
    status?: StringFilter<"Lote"> | string
    reservaVenceEm?: DateTimeNullableFilter<"Lote"> | Date | string | null
    comprador?: StringNullableFilter<"Lote"> | string | null
    compradorAnterior?: StringNullableFilter<"Lote"> | string | null
    reservaOwnerId?: StringNullableFilter<"Lote"> | string | null
  }

  export type PropostaUpsertWithWhereUniqueWithoutCorretorInput = {
    where: PropostaWhereUniqueInput
    update: XOR<PropostaUpdateWithoutCorretorInput, PropostaUncheckedUpdateWithoutCorretorInput>
    create: XOR<PropostaCreateWithoutCorretorInput, PropostaUncheckedCreateWithoutCorretorInput>
  }

  export type PropostaUpdateWithWhereUniqueWithoutCorretorInput = {
    where: PropostaWhereUniqueInput
    data: XOR<PropostaUpdateWithoutCorretorInput, PropostaUncheckedUpdateWithoutCorretorInput>
  }

  export type PropostaUpdateManyWithWhereWithoutCorretorInput = {
    where: PropostaScalarWhereInput
    data: XOR<PropostaUpdateManyMutationInput, PropostaUncheckedUpdateManyWithoutCorretorInput>
  }

  export type PropostaScalarWhereInput = {
    AND?: PropostaScalarWhereInput | PropostaScalarWhereInput[]
    OR?: PropostaScalarWhereInput[]
    NOT?: PropostaScalarWhereInput | PropostaScalarWhereInput[]
    id?: StringFilter<"Proposta"> | string
    loteId?: StringFilter<"Proposta"> | string
    corretorId?: StringFilter<"Proposta"> | string
    nomeCliente?: StringFilter<"Proposta"> | string
    telefoneCliente?: StringNullableFilter<"Proposta"> | string | null
    emailCliente?: StringNullableFilter<"Proposta"> | string | null
    payloadFinanceiro?: StringFilter<"Proposta"> | string
    status?: StringFilter<"Proposta"> | string
    criadaEm?: DateTimeFilter<"Proposta"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    loteId?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    evento?: StringFilter<"AuditLog"> | string
    payloadAnterior?: StringNullableFilter<"AuditLog"> | string | null
    payloadNovo?: StringNullableFilter<"AuditLog"> | string | null
    criadoEm?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type UserCreateWithoutLotesInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    propostas?: PropostaCreateNestedManyWithoutCorretorInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLotesInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    propostas?: PropostaUncheckedCreateNestedManyWithoutCorretorInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLotesInput, UserUncheckedCreateWithoutLotesInput>
  }

  export type PropostaCreateWithoutLoteInput = {
    id?: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
    corretor: UserCreateNestedOneWithoutPropostasInput
  }

  export type PropostaUncheckedCreateWithoutLoteInput = {
    id?: string
    corretorId: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
  }

  export type PropostaCreateOrConnectWithoutLoteInput = {
    where: PropostaWhereUniqueInput
    create: XOR<PropostaCreateWithoutLoteInput, PropostaUncheckedCreateWithoutLoteInput>
  }

  export type PropostaCreateManyLoteInputEnvelope = {
    data: PropostaCreateManyLoteInput | PropostaCreateManyLoteInput[]
  }

  export type AuditLogCreateWithoutLoteInput = {
    id?: string
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutLoteInput = {
    id?: string
    userId?: string | null
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutLoteInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutLoteInput, AuditLogUncheckedCreateWithoutLoteInput>
  }

  export type AuditLogCreateManyLoteInputEnvelope = {
    data: AuditLogCreateManyLoteInput | AuditLogCreateManyLoteInput[]
  }

  export type UserUpsertWithoutLotesInput = {
    update: XOR<UserUpdateWithoutLotesInput, UserUncheckedUpdateWithoutLotesInput>
    create: XOR<UserCreateWithoutLotesInput, UserUncheckedCreateWithoutLotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLotesInput, UserUncheckedUpdateWithoutLotesInput>
  }

  export type UserUpdateWithoutLotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    propostas?: PropostaUpdateManyWithoutCorretorNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    propostas?: PropostaUncheckedUpdateManyWithoutCorretorNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PropostaUpsertWithWhereUniqueWithoutLoteInput = {
    where: PropostaWhereUniqueInput
    update: XOR<PropostaUpdateWithoutLoteInput, PropostaUncheckedUpdateWithoutLoteInput>
    create: XOR<PropostaCreateWithoutLoteInput, PropostaUncheckedCreateWithoutLoteInput>
  }

  export type PropostaUpdateWithWhereUniqueWithoutLoteInput = {
    where: PropostaWhereUniqueInput
    data: XOR<PropostaUpdateWithoutLoteInput, PropostaUncheckedUpdateWithoutLoteInput>
  }

  export type PropostaUpdateManyWithWhereWithoutLoteInput = {
    where: PropostaScalarWhereInput
    data: XOR<PropostaUpdateManyMutationInput, PropostaUncheckedUpdateManyWithoutLoteInput>
  }

  export type AuditLogUpsertWithWhereUniqueWithoutLoteInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutLoteInput, AuditLogUncheckedUpdateWithoutLoteInput>
    create: XOR<AuditLogCreateWithoutLoteInput, AuditLogUncheckedCreateWithoutLoteInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutLoteInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutLoteInput, AuditLogUncheckedUpdateWithoutLoteInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutLoteInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutLoteInput>
  }

  export type LoteCreateWithoutPropostasInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    reservaOwner?: UserCreateNestedOneWithoutLotesInput
    auditLogs?: AuditLogCreateNestedManyWithoutLoteInput
  }

  export type LoteUncheckedCreateWithoutPropostasInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    reservaOwnerId?: string | null
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutLoteInput
  }

  export type LoteCreateOrConnectWithoutPropostasInput = {
    where: LoteWhereUniqueInput
    create: XOR<LoteCreateWithoutPropostasInput, LoteUncheckedCreateWithoutPropostasInput>
  }

  export type UserCreateWithoutPropostasInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    lotes?: LoteCreateNestedManyWithoutReservaOwnerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPropostasInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    lotes?: LoteUncheckedCreateNestedManyWithoutReservaOwnerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPropostasInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPropostasInput, UserUncheckedCreateWithoutPropostasInput>
  }

  export type LoteUpsertWithoutPropostasInput = {
    update: XOR<LoteUpdateWithoutPropostasInput, LoteUncheckedUpdateWithoutPropostasInput>
    create: XOR<LoteCreateWithoutPropostasInput, LoteUncheckedCreateWithoutPropostasInput>
    where?: LoteWhereInput
  }

  export type LoteUpdateToOneWithWhereWithoutPropostasInput = {
    where?: LoteWhereInput
    data: XOR<LoteUpdateWithoutPropostasInput, LoteUncheckedUpdateWithoutPropostasInput>
  }

  export type LoteUpdateWithoutPropostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    reservaOwner?: UserUpdateOneWithoutLotesNestedInput
    auditLogs?: AuditLogUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateWithoutPropostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    reservaOwnerId?: NullableStringFieldUpdateOperationsInput | string | null
    auditLogs?: AuditLogUncheckedUpdateManyWithoutLoteNestedInput
  }

  export type UserUpsertWithoutPropostasInput = {
    update: XOR<UserUpdateWithoutPropostasInput, UserUncheckedUpdateWithoutPropostasInput>
    create: XOR<UserCreateWithoutPropostasInput, UserUncheckedCreateWithoutPropostasInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPropostasInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPropostasInput, UserUncheckedUpdateWithoutPropostasInput>
  }

  export type UserUpdateWithoutPropostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lotes?: LoteUpdateManyWithoutReservaOwnerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPropostasInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lotes?: LoteUncheckedUpdateManyWithoutReservaOwnerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LoteCreateWithoutAuditLogsInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    reservaOwner?: UserCreateNestedOneWithoutLotesInput
    propostas?: PropostaCreateNestedManyWithoutLoteInput
  }

  export type LoteUncheckedCreateWithoutAuditLogsInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
    reservaOwnerId?: string | null
    propostas?: PropostaUncheckedCreateNestedManyWithoutLoteInput
  }

  export type LoteCreateOrConnectWithoutAuditLogsInput = {
    where: LoteWhereUniqueInput
    create: XOR<LoteCreateWithoutAuditLogsInput, LoteUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    lotes?: LoteCreateNestedManyWithoutReservaOwnerInput
    propostas?: PropostaCreateNestedManyWithoutCorretorInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    nome: string
    login: string
    senhaHash: string
    role?: string
    createdAt?: Date | string
    lotes?: LoteUncheckedCreateNestedManyWithoutReservaOwnerInput
    propostas?: PropostaUncheckedCreateNestedManyWithoutCorretorInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type LoteUpsertWithoutAuditLogsInput = {
    update: XOR<LoteUpdateWithoutAuditLogsInput, LoteUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<LoteCreateWithoutAuditLogsInput, LoteUncheckedCreateWithoutAuditLogsInput>
    where?: LoteWhereInput
  }

  export type LoteUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: LoteWhereInput
    data: XOR<LoteUpdateWithoutAuditLogsInput, LoteUncheckedUpdateWithoutAuditLogsInput>
  }

  export type LoteUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    reservaOwner?: UserUpdateOneWithoutLotesNestedInput
    propostas?: PropostaUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    reservaOwnerId?: NullableStringFieldUpdateOperationsInput | string | null
    propostas?: PropostaUncheckedUpdateManyWithoutLoteNestedInput
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lotes?: LoteUpdateManyWithoutReservaOwnerNestedInput
    propostas?: PropostaUpdateManyWithoutCorretorNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    login?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lotes?: LoteUncheckedUpdateManyWithoutReservaOwnerNestedInput
    propostas?: PropostaUncheckedUpdateManyWithoutCorretorNestedInput
  }

  export type LoteCreateManyReservaOwnerInput = {
    id: string
    n: string
    q: string
    area: number
    valor: number
    status: string
    reservaVenceEm?: Date | string | null
    comprador?: string | null
    compradorAnterior?: string | null
  }

  export type PropostaCreateManyCorretorInput = {
    id?: string
    loteId: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    loteId: string
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
  }

  export type LoteUpdateWithoutReservaOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    propostas?: PropostaUpdateManyWithoutLoteNestedInput
    auditLogs?: AuditLogUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateWithoutReservaOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    propostas?: PropostaUncheckedUpdateManyWithoutLoteNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutLoteNestedInput
  }

  export type LoteUncheckedUpdateManyWithoutReservaOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    n?: StringFieldUpdateOperationsInput | string
    q?: StringFieldUpdateOperationsInput | string
    area?: FloatFieldUpdateOperationsInput | number
    valor?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reservaVenceEm?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comprador?: NullableStringFieldUpdateOperationsInput | string | null
    compradorAnterior?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PropostaUpdateWithoutCorretorInput = {
    id?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lote?: LoteUpdateOneRequiredWithoutPropostasNestedInput
  }

  export type PropostaUncheckedUpdateWithoutCorretorInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropostaUncheckedUpdateManyWithoutCorretorInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    lote?: LoteUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    loteId?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropostaCreateManyLoteInput = {
    id?: string
    corretorId: string
    nomeCliente: string
    telefoneCliente?: string | null
    emailCliente?: string | null
    payloadFinanceiro: string
    status?: string
    criadaEm?: Date | string
  }

  export type AuditLogCreateManyLoteInput = {
    id?: string
    userId?: string | null
    evento: string
    payloadAnterior?: string | null
    payloadNovo?: string | null
    criadoEm?: Date | string
  }

  export type PropostaUpdateWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
    corretor?: UserUpdateOneRequiredWithoutPropostasNestedInput
  }

  export type PropostaUncheckedUpdateWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    corretorId?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropostaUncheckedUpdateManyWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    corretorId?: StringFieldUpdateOperationsInput | string
    nomeCliente?: StringFieldUpdateOperationsInput | string
    telefoneCliente?: NullableStringFieldUpdateOperationsInput | string | null
    emailCliente?: NullableStringFieldUpdateOperationsInput | string | null
    payloadFinanceiro?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    criadaEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutLoteInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    evento?: StringFieldUpdateOperationsInput | string
    payloadAnterior?: NullableStringFieldUpdateOperationsInput | string | null
    payloadNovo?: NullableStringFieldUpdateOperationsInput | string | null
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}