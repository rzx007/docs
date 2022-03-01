### Spring，SpringMVC，SpringBoot，SpringCloud 有什么区别和联系？

#### `spring和springMvc：`

1. spring 是一个一站式的轻量级的 java 开发框架，核心是控制反转（IOC）和面向切面（AOP），针对于开发的 WEB 层(springMvc)、业务层(Ioc)、持久层(jdbcTemplate)等都提供了多种配置解决方案；
2. springMvc 是 spring 基础之上的一个 MVC 框架，主要处理 web 开发的路径映射和视图渲染，属于 spring 框架中 WEB 层开发的一部分；

#### `springMvc 和 springBoot：`

1. springMvc 属于一个企业 WEB 开发的 MVC 框架，涵盖面包括前端视图开发、文件配置、后台接口逻辑开发等，XML、config 等配置相对比较繁琐复杂；
2. springBoot 框架相对于 springMvc 框架来说，更专注于开发微服务后台接口，不开发前端视图，同时遵循默认优于配置，简化了插件配置流程，不需要配置 xml，相对 springmvc，大大简化了配置流程；

#### `springBoot 和 springCloud：`

1. spring boot 使用了默认大于配置的理念，集成了快速开发的 spring 多个插件，同时自动过滤不需要配置的多余的插件，简化了项目的开发配置流程，一定程度上取消 xml 配置，是一套快速配置开发的脚手架，能快速开发单个微服务；
2. spring cloud 大部分的功能插件都是基于 springBoot 去实现的，springCloud 关注于全局的微服务整合和管理，将多个 springBoot 单体微服务进行整合以及管理； springCloud 依赖于 springBoot 开发，而 springBoot 可以独立开发；

 #### 总结：
 1. Spring 框架就像一个家族，有众多衍生产品例如 boot、security、jpa 等等。但他们的基础都是 Spring 的 ioc、aop 等. ioc 提供了依赖注入的容器， aop 解决了面向横切面编程，然后在此两者的基础上实现了其他延伸产品的高级功能；
 2. springMvc 是基于 Servlet 的一个 MVC 框架主要解决 WEB 开发的问题，因为 Spring 的配置非常复杂，各种 XML、JavaConfig、servlet 处理起来比较繁琐；
 3. 为了简化开发者的使用，从而创造性地推出了 springBoot 框架，默认优于配置，简化了 springMvc 的配置流程；但区别于 springMvc 的是，springBoot 专注于微服务方面的接口开发，和前端解耦，虽然 springBoot 也可以做成 springMvc 前后台一起开发，但是这就有点不符合 springBoot 框架的初衷了；
 4. 对于 springCloud 框架来说，它和 springBoot 一样，注重的是微服务的开发，但是 springCloud 更关注的是全局微服务的整合和管理，相当于管理多个 springBoot 框架的单体微服务；

?> 补充 [spring-boot常用注解](https://www.cnblogs.com/fishpro/p/spring-boot-study-restcontroller.html)
?> 补充 [超详细！4小时开发一个SpringBoot+vue前后端分离博客项目！！](https://www.zhuawaba.com/post/17)
?>  [网络通信协议](http://www.52im.net/thread-1095-1-1.html)