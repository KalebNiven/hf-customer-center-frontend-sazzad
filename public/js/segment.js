// function segmentTrack(action, props=null) {
//     if (props != null) {
//         analytics.track(action, props);
//     }else{
//         analytics.track(action);
//     }
// }

// function segmentIdentifyMember(CustomerId, fullName, memberEmail, oktaId, memberId){
//     analytics.identify(CustomerId, {
//             traits: {
//                 email: memberEmail,
//                 name: fullName
//             }
//         },
//         {
//             context: {
//                 externalIds:
//                 [
//                     {
//                         collection: "users",
//                         encoding: "none",
//                         id: oktaId,
//                         type: "okta_id"
//                     },
//                     {
//                         collection: "users",
//                         encoding: "none",
//                         id: memberId,
//                         type: "member_id"
//                     }
//                 ]
//             }
//         }
//     );
// }

// function segmentIdentifyNonMember(fullName, memberEmail, oktaId){
//     analytics.identify(
//         {
//             anonymousId: oktaId,
//             traits: {
//                 email: memberEmail,
//                 name: fullName
//             }
//         },
//         {
//             context: {
//                 externalIds: [
//                     {
//                         collection: "users",
//                         encoding: "none",
//                         id: oktaId,
//                         type: "okta_id"
//                     }
//                 ]
//             }
//         }
//     );
// }

// // $(document).ready(function() {
// //     $('a, button:not(#navbar-hamburger, #dropdownMenuButton2)').click(function() {
// //         var text = $(this).attr('segment-track');
// //         var props = $(this).attr('segment-props');

// //         if (props != null){
// //             segmentTrack(text, JSON.parse(props));
// //         }
// //         else {
// //             try{
// //             segmentTrack(text);
// //             }
// //             catch(e){
// //                 console.log(e);
// //             }
// //         }
        
// //     });

// //     $('#header-dropdown-logout, #oktaLogoutUrl').click(function() {
// //         analytics.reset();
// //     });

// // });
